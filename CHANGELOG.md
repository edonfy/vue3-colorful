# Changelog

## 0.2.0

### Minor Changes

- - ♿ Add accessibility (a11y) support with full keyboard navigation
  - 🎨 Redesign example app with a modern "premium" UI and copy-to-clipboard functionality
  - 📚 Integrate Storybook 10 for interactive component documentation and testing
  - 🦋 Initialize Changesets for professional versioning and changelog management
  - ⚡ Upgrade core dependencies (Vite 6, Vitest 3, UnoCSS) and optimize build configuration
  - 🛠 Added build analysis tool (rollup-plugin-visualizer) and .npmignore for smaller bundle size

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Test coverage configuration with @vitest/coverage-v8
- GitHub Actions CI/CD workflows
- Prettier code formatting
- Husky pre-commit hooks
- EditorConfig for consistent editor settings
- LICENSE file
- CONTRIBUTING guide

### Changed

- Upgraded Vue to ^3.5.0
- Upgraded TypeScript to ^5.8.0
- Upgraded Vite to ^6.0.0
- Upgraded Vitest to ^3.0.0
- Switched from npm to pnpm package manager
- Updated peer dependency to Vue 3.5+

### Fixed

- ESLint configuration with Prettier integration

## [0.1.1] - 2024-03-20

### Added

- Initial release
- Color picker component with Hex, RGB, HSV, HSL, CMYK support
- Alpha channel support
- TypeScript definitions
- Vue 3 Composition API and JSX components

### Features

- Multiple color format support
- Tiny bundle size (~3KB gzipped)
- Zero dependencies (except Vue 3)
- Full TypeScript support
- Responsive design
