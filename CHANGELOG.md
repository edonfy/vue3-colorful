## 0.3.0 (2025-03-24)

### Added

- 🏗️ **PickerFactory**: Centralized factory pattern for all specialized pickers, reducing boilerplate by ~600 lines.
- ⚡ **Performance Optimizations**:
  - Implemented `useInteraction` composable with `requestAnimationFrame` throttling.
  - Added LRU cache (100 items) for color conversions in `utils/convert.ts`.
  - Pre-compiled regular expressions for color parsing.
- 🛡️ **Robustness & Error Handling**:
  - Error-first parsing in `utils/converter.ts` with explicit error throwing for invalid formats.
  - Real-time validation and error state (red border) for `ColorInput`.
- ♿ **A11Y Enhancements**: Full support for `Home`, `End`, `PageUp`, and `PageDown` keys in all sliders and saturation areas.
- 🧪 **Test Suite Expansion**: Added comprehensive tests for `PickerFactory`, `useInteraction`, and edge-case color conversions. Total 72 tests passing.

---

## 0.2.2

### Added

- ✨ Structural refactor of `BasePicker` to support stable vertical layouts with presets and input
- 🎨 Refined vertical orientation with 12px gaps and polished 6px padding for alignment
- 🌓 Improved saturation area border-radius for vertical layout consistency
- ⌨️ Fully documented manual input, dark mode, and theming in README

### Fixed

- 🐛 Corrected vertical slider dimensions (no longer squashed in flex row)
- 🐛 Fixed pointer clipping in vertical orientation by adding container safety zones
- 🐛 Resolved presets and manual input displacement when vertical mode is active

## 0.2.1

### Patch Changes

- - 📝 Update README.md with detailed accessibility (a11y) support, Storybook integration, and modern tech stack information
  - ✨ Final polish for the premium demo and project structure documentation

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
