# GitHub Workflow Rebuild Design

**Date:** 2026-03-28

**Status:** Approved for spec drafting

**Goal**

Rebuild the GitHub Actions setup around three explicit needs:

1. Run code checks and tests on every push and pull request.
2. Publish a new npm version only when a release tag is pushed.
3. Update the example site only as part of that tagged release flow.

**Why This Change**

The current workflow layout mixes validation, release, and site deployment concerns across multiple files. That makes it easier for one workflow to succeed while another fails for an unrelated reason, and it makes the release path harder to reason about.

The replacement design makes each workflow map directly to a user-visible outcome:

- `ci.yml` validates code quality and compatibility.
- `release.yml` performs a tagged release transaction end to end.

## Desired Repository Behavior

### Normal Development

- Any `push` to `main` or `master` runs `ci.yml`.
- Any pull request targeting `main` or `master` runs `ci.yml`.
- No npm publish happens during normal development.
- No example site deployment happens during normal development.

### Release Flow

- A pushed tag matching `v*` triggers `release.yml`.
- The tag must match the package version in `package.json`.
- The tagged commit must already contain the final release assets and metadata, including the intended version and changelog edits.
- The workflow publishes the package to npm.
- The workflow deploys the example site from the same tagged commit.
- The workflow creates or updates the GitHub Release entry for that tag.

## File Layout

### Keep

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

### Remove or Replace

- `.github/workflows/deploy-pages.yml`
  This file is no longer needed as an independent workflow because example deployment becomes part of the release transaction.

## Workflow Responsibilities

## `ci.yml`

**Purpose**

Act as the only daily validation workflow for source changes.

**Triggers**

- `push` on `main` and `master`
- `pull_request` on `main` and `master`

**Jobs**

### `test`

Runs on `ubuntu-latest` with a Node matrix.

**Matrix**

- `20.x`
- `22.x`

**Node 20 responsibilities**

- `pnpm install --frozen-lockfile`
- `pnpm type-check`
- `pnpm lint`
- `pnpm build`
- `pnpm build:example`
- `pnpm test:run`
- `pnpm test:coverage`

**Node 22 responsibilities**

- `pnpm install --frozen-lockfile`
- `pnpm type-check`
- `pnpm build`
- `pnpm test:run`

Node 22 is kept as a compatibility lane, not a duplicate of the full primary lane.

### `visual`

Runs on `macos-latest`.

**Responsibilities**

- `pnpm install --frozen-lockfile`
- Install Chromium for Playwright
- `pnpm test:visual`

The visual job stays on macOS because the committed snapshots are darwin-based and the project already validated that direction.

**Explicit Non-Goals for `ci.yml`**

- No npm publish
- No automatic version bumping
- No tag creation
- No example site deployment

## `release.yml`

**Purpose**

Handle one full release transaction from an explicit version tag.

**Trigger**

- `push.tags: ['v*']`

**Permissions**

- `contents: write`
- `pages: write`
- `id-token: write`

If GitHub Release creation is done through the GitHub API or an action using the default token, `contents: write` is sufficient. No workflow should require repository writes beyond the release process itself.

**Top-Level Principle**

This workflow must not compute a new version. It only verifies and publishes the version already committed in the repository.

### `verify-tag`

Runs first on `ubuntu-latest`.

**Responsibilities**

- Check out the exact tagged commit.
- Install dependencies with `pnpm install --frozen-lockfile`.
- Read `package.json.version`.
- Fail if the pushed tag does not equal `v${package.json.version}`.
- Verify the tagged commit is reachable from `origin/main`.
- Run `pnpm build`.
- Run `pnpm build:example`.

This job proves that the tag points to the intended release commit and that the release artifacts can still be built from clean checkout state.

### `publish-npm`

Depends on `verify-tag`.

**Responsibilities**

- Publish the package using `pnpm publish --no-git-checks`.
- Authenticate with `NPM_TOKEN`.

The workflow publishes exactly what is in the tagged commit. It does not mutate git state or create release commits.

### `deploy-example`

Depends on `publish-npm`.

**Responsibilities**

- Build the example app from the same tag.
- Configure GitHub Pages.
- Upload the `dist-example` artifact.
- Deploy Pages.

The deployment uses the release tag source rather than the latest branch tip. That keeps the published docs/example site aligned with the npm package users are installing.

### `create-github-release`

Depends on `publish-npm` and `deploy-example`.

**Responsibilities**

- Create or update the GitHub Release for the pushed tag.
- Use the tag name as the release version.
- Prefer release notes derived from the committed changelog rather than generated changeset state.

This job runs last so the visible GitHub release metadata reflects a release that has already published npm and updated the example site. If it fails, the workflow should fail loudly even though publish and deployment may already have completed.

## Release Invariants

The new process depends on these rules:

- Version changes happen in git before tagging.
- The release tag is the single source of truth for when publishing is allowed.
- `release.yml` never writes version files back to the repo.
- The example site always reflects the exact released tag, not the newest `main` commit.

## Changesets Policy

Changesets may still be used locally for preparing version bumps and changelog entries, but they are no longer part of the GitHub Actions publish path.

That means:

- No `changesets/action` in CI.
- No release PR automation in GitHub Actions.
- No automatic publish on every merge to `main`.

If the team later wants automated release PRs again, that would be a separate design change and should not be mixed into this rebuild.

## Failure Model

### CI Failure

- Blocks merge confidence.
- Does not publish anything.
- Does not update the example site.

### Release Verification Failure

- Tag exists, but release stops before publish.
- npm is not updated.
- example site is not updated.

### npm Publish Failure

- Release fails.
- example site deployment must not run.
- GitHub Release creation must not run.

### Example Deploy Failure

- npm package may already be published.
- Workflow must clearly show that the site deployment failed after publish.
- This is acceptable because npm publication cannot be rolled back automatically in the workflow.

## Secrets and Environment

### Required Secrets

- `NPM_TOKEN`

### Optional Secrets

- A custom GitHub token is optional unless organizational policy requires it.

The preferred default is to use `github.token` where possible and avoid custom long-lived repository tokens unless there is a concrete permission gap.

## Migration Plan

1. Rewrite `ci.yml` so it only contains validation jobs.
2. Rewrite `release.yml` to be tag-driven and remove `changesets/action`.
3. Remove release-on-branch behavior.
4. Fold Pages deployment logic into `release.yml`.
5. Delete `deploy-pages.yml`.
6. Validate YAML structure locally.
7. Run local checks that correspond to the new workflow responsibilities.
8. Land the workflow change.
9. On the next tagged release, verify:
   - `ci.yml` no longer attempts release behavior
   - `release.yml` publishes npm from the tag
   - `release.yml` deploys the example site from the same tag

## Implementation Scope

### Files To Modify

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

### Files To Delete

- `.github/workflows/deploy-pages.yml`

### Files That May Need Light Documentation Updates

- `README.md`
- `CHANGELOG.md`

Documentation updates are optional for the workflow rewrite itself unless the README currently documents the old release model.

## Success Criteria

The rebuild is successful when all of the following are true:

- `ci.yml` is the only workflow that runs on normal pushes and pull requests for validation.
- `release.yml` runs only on pushed version tags.
- A pushed `vX.Y.Z` tag publishes npm only when `package.json.version === X.Y.Z`.
- The example site deploys only from the release tag flow.
- No workflow performs automatic version calculation or branch-triggered publishing.
- The workflow files are easier to reason about because each one has a single clear purpose.
