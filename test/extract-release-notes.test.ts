import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

import { describe, expect, it } from 'vitest'

const scriptPath = resolve(process.cwd(), 'scripts/extract-release-notes.mjs')

function runExtractReleaseNotes(options: {
  version: string
  primaryContent: string
  fallbackContent?: string
}) {
  const tempDir = mkdtempSync(join(tmpdir(), 'vue3-colorful-release-notes-'))
  const primaryPath = join(tempDir, 'CHANGELOG.primary.md')
  const outputPath = join(tempDir, 'RELEASE_NOTES.md')
  const commandArgs = [
    scriptPath,
    '--version',
    options.version,
    '--source',
    primaryPath,
    '--output',
    outputPath,
  ]

  writeFileSync(primaryPath, options.primaryContent)

  if (typeof options.fallbackContent === 'string') {
    const fallbackPath = join(tempDir, 'CHANGELOG.fallback.md')

    writeFileSync(fallbackPath, options.fallbackContent)
    commandArgs.push('--fallback-source', fallbackPath)
  }

  const result = spawnSync(process.execPath, commandArgs, {
    encoding: 'utf8',
  })

  const releaseNotes =
    result.status === 0 && result.error == null ? readFileSync(outputPath, 'utf8') : ''

  rmSync(tempDir, { force: true, recursive: true })

  return {
    ...result,
    releaseNotes,
  }
}

describe('extract-release-notes script', () => {
  it('falls back to the default branch changelog when the tagged changelog is missing the release entry', () => {
    const result = runExtractReleaseNotes({
      version: '0.5.4',
      primaryContent: ['## Unreleased', '', '## 0.5.3', '', '- Existing release notes.'].join('\n'),
      fallbackContent: [
        '## Unreleased',
        '',
        '## 0.5.4',
        '',
        '- Release notes restored from the default branch.',
        '',
        '## 0.5.3',
        '',
        '- Existing release notes.',
      ].join('\n'),
    })

    expect(result.status).toBe(0)
    expect(result.releaseNotes).toBe('- Release notes restored from the default branch.\n')
  })
})
