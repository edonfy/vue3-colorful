## 0.4.5 (2026-03-26)

### 🐛 Bug Fixes

- 🐛 **Review Follow-ups**: Fixed invalid `ColorInput` blur emission, aligned README exports, and tightened public contract checks.
- 🎨 **Example App**: Restored dedicated `view` routes for visual regression, refreshed snapshots, and fixed the Hex demo saturation height.
- ♿ **Runtime Behavior**: Improved blank color handling, preset normalization, hue slider ARIA metadata, and pointer capture guards.

### 🏠 Tooling

- 🧪 **Visual Testing**: Switched visual coverage to the Vite example app and kept stable snapshot entrypoints.
- 🏗️ **Demo Infrastructure**: Replaced the old Storybook setup with a TSX example app plus size/performance baseline tooling.

---

## 0.4.4 (2026-03-25)

### 🐛 Bug Fixes

- 🐛 **Docs**: Fixed incorrect CSS import path (`dist/style.css` → `dist/vue3-colorful.css`).
- 🐛 **Docs**: Fixed Tailwind plugin import syntax (named import → default import).
- 🐛 **Docs**: Updated coverage badge (92% → 94%), test count (94 → 100+), and removed unused CSS variables from theming table.
- 📦 **Exports**: Added `./style.css` subpath export to `package.json`.

---

## 0.4.3 (2026-03-25)

### 🧹 Code Quality

- 🧹 **Audit**: Import order, type safety, dead code removal, and test coverage improvements.

---

## 0.4.2 (2026-03-25)

### 🐛 Bug Fixes

- 🐛 **ColorInput**: Synced `lastEmittedValue` to prevent stale state on external updates.
- 🐛 **useColorState**: Improved echo handling to avoid redundant emissions.
- 🐛 **Hue**: Semantic `End` key behavior aligned with slider orientation.
- ⌨️ **useInteraction**: Added dev warnings for missing pointer capture.
- 🎨 **Styles**: Added `contain` performance hints to interactive elements.

---

## 0.4.1 (2025-03-25)

### 🐛 Bug Fixes

- 🐛 **Popover Animation**: Refactored `ColorPickerPopover` to use CSS-driven `data-status` transitions, eliminating flicker at (0,0) and adding smooth exit animation.
- 🐛 **Lint**: Fixed `Pointer` component missing `default` prop; replaced `@ts-ignore` with `@ts-expect-error` in `Eyedropper`.

### ⚡ Performance

- ⚡ **Bundle Size**: Reduced core bundle from ~15.5KB to ~7.2KB gzip by removing inline style computation in favor of CSS class-driven animation.

### 🧪 Testing

- ✅ Added 4 new animation status tests for `ColorPickerPopover` (94 total).

---

## 0.4.0 (2025-03-25)

### 🚀 Major Improvements

- ✨ **Popover Mode**: Added `ColorPickerPopover`, a built-in compact floating picker using `@floating-ui`.
- 🧩 **Ecosystem Plugins**: Native integration for **Tailwind CSS**, **UnoCSS**, and **Nuxt 3**.
- 🌓 **Dark Mode**: Premium dark theme support across all components.
- ♿ **WCAG 2.1 Compliance**: Full ARIA support, screen reader compatibility, and refined contrast.

### 🏠 Infrastructure

- 🏗️ **Package Architecture**: Fixed critical `package.json` export paths (`main`, `module`, `require`) for full CJS/ESM compatibility.
- 📦 **Optimized Bundling**: Externalized `@floating-ui/vue`, reducing the core bundle size by **~50%**.
- 🔌 **Nuxt Module**: Fixed CSS resolution and added `ColorPickerPopover` to auto-imports.

### 🐛 Bug Fixes

- 🐛 **Interaction**: Fixed vertical direction inversion in `Hue`/`Alpha`. Added `pointercancel` support and a right-click guard.
- 🐛 **Reactivity**: Fixed `useColorState` empty string sync and prevented double-emission in `ColorInput`.
- 🐛 **UI/UX**: Encoded SVG data URLs, added `prefers-reduced-motion`, and ensured global `border-box` layout.

---

## 0.3.0 (2025-03-24)

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
