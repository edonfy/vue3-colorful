# vue3-colorful 🎨

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-colorful"><img src="https://img.shields.io/npm/v/vue3-colorful" alt="npm version"></a>
  <a href="https://github.com/edonfy/vue3-colorful/actions"><img src="https://github.com/edonfy/vue3-colorful/workflows/CI/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/coverage-100%25-green" alt="Coverage">
  <img src="https://img.shields.io/badge/gzipped-~14.4KB-blue" alt="Size">
</p>

A tiny, fast, and accessible color picker component for Vue 3. Highly optimized and modernized with premium aesthetics and first-class ecosystem support.

---

## 🌟 Key Features

- 🌳 **Tree-shakable** - Import only the models you need (Hex, RGB, HSL, HSV, CMYK).
- 🎈 **Popover Mode** - Built-in floating picker support with `@floating-ui`.
- 🧩 **Ecosystem Plugins** - Native integration for **Tailwind CSS**, **UnoCSS**, and **Nuxt 3**.
- ♿ **Accessible** - Full ARIA support and comprehensive keyboard navigation.
- 🌓 **Dark Mode** - Built-in premium dark theme with simple toggle.
- 🚀 **Performant** - Ultra-smooth 60fps interactions via RAF throttling and LRU caching.
- ✅ **Industrial Stability** - Automated Visual Regression & 72+ Unit tests.

## 🚀 Installation

```bash
# Using pnpm (recommended)
pnpm add vue3-colorful

# Using npm
npm install vue3-colorful
```

## 📦 Usage

### Specialized Pickers (Recommended)

For the best bundle size, import the specific component for your color model.

```vue
<script setup>
import { ref } from 'vue'
import { HexColorPicker } from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('#3b82f6')
</script>

<template>
  <HexColorPicker v-model="color" />
</template>
```

**Available Components**: `HexColorPicker`, `RgbColorPicker`, `HslColorPicker`, `HsvColorPicker`, `CmykColorPicker`.

### Popover Mode (v0.4.0+)

A compact floating picker component.

```vue
<template>
  <ColorPickerPopover v-model="color" show-input />
</template>

<script setup>
import { ref } from 'vue'
import { ColorPickerPopover } from 'vue3-colorful'

const color = ref('#3b82f6')
</script>
```

## 🧩 Ecosystem Support

### Tailwind CSS

Theme the picker directly from your `tailwind.config.js`.

```js
// tailwind.config.js
import { tailwindPlugin } from 'vue3-colorful/tailwind'

export default {
  theme: {
    vue3Colorful: {
      accentColor: '#3b82f6',
      borderRadius: '12px',
    },
  },
  plugins: [tailwindPlugin],
}
```

### Nuxt 3

Zero-config module with auto-imports and CSS injection.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue3-colorful/nuxt'],
})
```

### UnoCSS

```ts
// uno.config.ts
import { unocssPreset } from 'vue3-colorful/unocss'

export default defineConfig({
  presets: [unocssPreset()],
})
```

## 🛠️ Props & Customization

| Prop             | Type       | Default | Description                   |
| ---------------- | ---------- | ------- | ----------------------------- |
| `modelValue`     | `string`   | `''`    | Value (v-model)               |
| `showAlpha`      | `boolean`  | `false` | Enable alpha channel slider   |
| `showEyedropper` | `boolean`  | `false` | Enable native EyeDropper tool |
| `presets`        | `string[]` | `[]`    | List of color swatches        |
| `dark`           | `boolean`  | `false` | Enable premium dark theme     |
| `showInput`      | `boolean`  | `false` | Show manual text input        |
| `vertical`       | `boolean`  | `false` | Orient sliders vertically     |

### Theming (CSS Variables)

| Variable             | Default   | Description               |
| -------------------- | --------- | ------------------------- |
| `--vc-width`         | `200px`   | Width of the picker       |
| `--vc-accent-color`  | `#3b82f6` | Active/Focus accent color |
| `--vc-border-radius` | `8px`     | Corner radius of elements |

## 🧪 Quality Assurance

We maintain 100% UI stability through:

- **Unit Tests**: 72+ tests for core transformations and events.
- **Visual Regression**: Playwright snapshots for all component variants.
- **Modern Stack**: Built with Vite 6, Vitest 3, and TypeScript 5.

---

## License

MIT
