# vue3-colorful 🎨

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-colorful"><img src="https://img.shields.io/npm/v/vue3-colorful" alt="npm version"></a>
  <a href="https://github.com/edonfy/vue3-colorful/actions"><img src="https://github.com/edonfy/vue3-colorful/workflows/CI/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/coverage-92%25-green" alt="Coverage">
  <img src="https://img.shields.io/badge/gzipped-~10KB-blue" alt="Size">
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
- ✅ **Industrial Stability** - Automated Visual Regression & 90+ Unit tests.

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

Theme calculation is automated.

```js
// tailwind.config.js
import { tailwindPlugin } from 'vue3-colorful/tailwind'

export default {
  theme: {
    vue3Colorful: {
      accentColor: '#3b82f6',
      borderRadius: '12px',
      // Supports: width, height, pointerSize, sliderHeight, bgColor, textColor, borderColor
    },
  },
  plugins: [tailwindPlugin],
}
```

### Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue3-colorful/nuxt'],
  vue3Colorful: {
    disableCss: false, // Set to true to use your own styles
  },
})
```

### UnoCSS

```ts
// uno.config.ts
import { presetVue3Colorful } from 'vue3-colorful/unocss'

export default defineConfig({
  presets: [presetVue3Colorful()],
})
```

## 🛠️ Props & Customization

### Specialized Pickers

Components: `HexColorPicker`, `RgbColorPicker`, `HslColorPicker`, `HsvColorPicker`, `CmykColorPicker`.

| Prop             | Type       | Default | Description                   |
| ---------------- | ---------- | ------- | ----------------------------- |
| `modelValue`     | `string`   | `''`    | Color value (v-model)         |
| `showAlpha`      | `boolean`  | `false` | Enable alpha channel slider   |
| `showEyedropper` | `boolean`  | `false` | Enable native EyeDropper tool |
| `presets`        | `string[]` | `[]`    | List of color swatches        |
| `dark`           | `boolean`  | `false` | Enable premium dark theme     |
| `showInput`      | `boolean`  | `false` | Show manual text input        |
| `vertical`       | `boolean`  | `false` | Orient sliders vertically     |
| `colorLabel`     | `string`   | `''`    | Label for accessibility       |

### Generic ColorPicker

A flexible component that supports multiple models.

```vue
<ColorPicker v-model="color" color-model="rgb" />
```

### Popover Mode

```vue
<ColorPickerPopover v-model="color" show-input>
  <template #default="{ isOpen, color }">
    <button>Custom Trigger (Current: {{ color }})</button>
  </template>
</ColorPickerPopover>
```

### Slots (Advanced UI)

All pickers support the following named slots for custom pointers/tracks:

- `saturation-pointer`, `saturation-track`
- `hue-pointer`, `hue-track`
- `alpha-pointer`, `alpha-track`

### Theming (CSS Variables)

| Variable             | Default                      |
| -------------------- | ---------------------------- |
| `--vc-width`         | `200px`                      |
| `--vc-height`        | `200px`                      |
| `--vc-border-radius` | `8px`                        |
| `--vc-pointer-size`  | `28px`                       |
| `--vc-slider-height` | `24px`                       |
| `--vc-accent-color`  | `#3b82f6`                    |
| `--vc-shadow`        | `0 4px 12px rgba(0,0,0,0.1)` |
| `--vc-bg-color`      | `#ffffff`                    |
| `--vc-text-color`    | `#ffffff` (labels)           |
| `--vc-border-color`  | `rgba(0,0,0,0.05)`           |
| `--vc-preset-gap`    | `8px`                        |

## ⌨️ Keyboard Navigation

The picker is fully accessible via keyboard:

- **Arrow Keys**: Move the pointer in 1% increments.
- **Shift + Arrow**: Move in 10% increments.
- **Home / End**: Move to minimum or maximum values.
- **PageUp / PageDown**: Move in large increments.
- **Tab**: Focus between sliders and the input field.

## 💻 Browser Compatibility

- **Vue**: ^3.2.0
- **Modern Browsers**: Chrome, Firefox, Safari, Edge.
- **EyeDropper API**: Supported in Chromium-based browsers (Chrome, Edge, Opera). Native support fallback is handled gracefully.

## ❓ Troubleshooting

### My styles are not appearing

Ensure you import the CSS file in your main entry point:
`import 'vue3-colorful/dist/style.css'`

### Nuxt 3 Error

If you face SSR issues, ensure the module is added to `nuxt.config.ts` modules array as shown in the ecosystem section.

---

## 🧪 Quality Assurance

- **Unit Tests**: 90+ tests for core transformations.
- **Visual Regression**: Playwright snapshots for all variants.
- **Modern Stack**: Built with Vite 6, Vitest 3, and TypeScript 5.

## License

MIT (c) 2024-present edonfy
