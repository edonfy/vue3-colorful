# vue3-colorful

<p align="center">
A tiny Vue 3 color picker component (~14.4KB gzipped)
</p>

<p align="center">
Inspired by <a href="https://omgovich.github.io/react-colorful/">react-colorful</a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/vue3-colorful"><img src="https://img.shields.io/npm/v/vue3-colorful" alt="npm version"></a>
<a href="https://github.com/edonfy/vue3-colorful/actions"><img src="https://github.com/edonfy/vue3-colorful/workflows/CI/badge.svg" alt="CI"></a>
<a href="https://www.npmjs.com/package/vue3-colorful"><img src="https://img.shields.io/npm/dm/vue3-colorful" alt="npm downloads"></a>
</p>

## Features

- [x] **80%+ Test Coverage** - Verified with Vitest and v8 coverage
- 🌳 **Tree-shakable** - Specialized components for each color model to minimize bundle size
- ♿ **Accessibility (a11y)** - Full keyboard navigation and ARIA compliance
- 🎨 **Multiple color formats** - Support for Hex, RGB, HSV, HSL, CMYK
- 🎈 **Popover Mode** - Built-in floating picker support with `@floating-ui`
- 🧩 **Ecosystem Plugins** - Tailwind CSS Plugin, UnoCSS Preset, and Nuxt 3 Module
- 📦 **Tiny size** - ~14.4KB gzipped (Full package, tree-shakable)
- 🌈 **Alpha channel** - Optional transparency support
- 🌓 **Dark Mode** - Built-in premium dark theme support
- ⌨️ **Manual Input** - Optional text input for precise color entry
- ✅ **Visual Regression** - Automated QA for UI stability (Playwright)

## Installation

> [!IMPORTANT]
> This library requires **Node.js 20.x** or higher and **Vue 3.2+**.

```bash
# Using pnpm (recommended)
pnpm add vue3-colorful

# Using npm
npm install vue3-colorful
```

## Specialized Pickers (Tree-shakable)

For the best bundle size, import the specific component for the color model you need.

```vue
<script setup>
import { ref } from 'vue'
import { HexColorPicker } from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('#ff6600')
</script>

<template>
  <HexColorPicker v-model="color" />
</template>
```

### Popover Mode (v0.4.0+)

```vue
<template>
  <ColorPickerPopover v-model="color" />
</template>

<script setup>
import { ref } from 'vue'
import { ColorPickerPopover } from 'vue3-colorful'

const color = ref('#3b82f6')
</script>
```

Available specialized components:

- `HexColorPicker`
- `RgbColorPicker`
- `HslColorPicker`
- `HsvColorPicker`
- `CmykColorPicker`

## Basic Usage (Universal)

The default export is a "universal" picker that auto-detects the color format.

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('#ff6600')
</script>

<template>
  <ColorPicker v-model="color" />
</template>
```

## Features & Customization

### Alpha Channel

Enable the alpha slider by passing the `show-alpha` prop.

```vue
<template>
  <HexColorPicker v-model="color" show-alpha />
</template>
```

### Eyedropper API

Enable the native browser Eyedropper tool to pick colors from anywhere on the screen.

```vue
<template>
  <HexColorPicker v-model="color" show-eyedropper />
</template>
```

### Color Presets (Swatches)

Provide a list of predefined colors for quick selection.

```vue
<script setup>
const presets = ['#ff0000', '#00ff00', '#0000ff']
</script>

<template>
  <HexColorPicker v-model="color" :presets="presets" />
</template>
```

### Dark Mode

Pass the `dark` prop to enable the built-in dark theme.

```vue
<template>
  <HexColorPicker v-model="color" dark />
</template>
```

### Manual Input

Enable a manual text input field for precise color entry.

```vue
<template>
  <HexColorPicker v-model="color" show-input color-label="Hex" />
</template>
```

### Vertical Sliders (Layout Flexibility)

Align the hue and alpha sliders vertically by passing `vertical`.

```vue
<template>
  <HexColorPicker v-model="color" vertical />
</template>
```

### Custom Slots (Advanced)

For advanced customization, you can override the default UI of the sliders and pointers using slots.

```vue
<template>
  <HexColorPicker v-model="color">
    <!-- Custom Hue Slider Pointer -->
    <template #hue-pointer="{ left, top, color }">
      <div class="custom-pointer" :style="{ left: `${left * 100}%`, backgroundColor: color }" />
    </template>

    <!-- Custom Saturation Area Pointer -->
    <template #saturation-pointer="{ left, top, color }">
      <div class="custom-crosshair" :style="{ left: `${left * 100}%`, top: `${top * 100}%` }" />
    </template>
  </HexColorPicker>
</template>
```

Available slots:

- `#hue-track`, `#hue-pointer`
- `#alpha-track`, `#alpha-pointer`
- `#saturation-track`, `#saturation-pointer`

Each pointer slot provides `{ left, top, color }` as scope. `left` and `top` are fractions (0-1).

## Theming (CSS Variables)

The entire library is built with CSS Variables (prefixed with `--vc-`) for easy customization.

```css
/* Customizing the picker appearance */
.your-custom-picker {
  --vc-width: 300px;
  --vc-border-radius: 20px;
  --vc-accent-color: #ef4444;
  --vc-pointer-size: 32px;
}
```

| Variable             | Default                      | Description                    |
| -------------------- | ---------------------------- | ------------------------------ |
| `--vc-width`         | `200px`                      | Width of the picker            |
| `--vc-height`        | `200px`                      | Total height (excluding input) |
| `--vc-border-radius` | `8px`                        | Corner radius of elements      |
| `--vc-pointer-size`  | `28px`                       | Size of the picker handle      |
| `--vc-accent-color`  | `#3b82f6`                    | Active/Focus color             |
| `--vc-slider-height` | `24px`                       | Height (or width) of sliders   |
| `--vc-bg-color`      | `#fff` / `#222`              | Background of presets/input    |
| `--vc-shadow`        | `0 4px 12px rgba(0,0,0,0.1)` | Main picker shadow             |

## API

### Props

| Prop             | Type         | Default | Description                                |
| ---------------- | ------------ | ------- | ------------------------------------------ |
| `modelValue`     | `string`     | `''`    | The color value (v-model)                  |
| `colorModel`     | `ColorModel` | `'hex'` | Output format (Universal Picker only)      |
| `showAlpha`      | `boolean`    | `false` | Show alpha channel slider                  |
| `showEyedropper` | `boolean`    | `false` | Enable the native EyeDropper tool          |
| `presets`        | `string[]`   | `[]`    | Array of color strings for quick selection |
| `dark`           | `boolean`    | `false` | Enable built-in dark theme                 |
| `showInput`      | `boolean`    | `false` | Show manual text input field               |
| `colorLabel`     | `string`     | `''`    | Label text for the manual input            |
| `vertical`       | `boolean`    | `false` | Orient sliders vertically (row layout)     |

### Supported Color Models

- `'hex'` (Default)
- `'rgb'` (rgba)
- `'hsl'` (hsla)
- `'hsv'` (hsva)
- `'cmyk'`

## Comparison with react-colorful

| Feature       | vue3-colorful            | react-colorful     |
| ------------- | ------------------------ | ------------------ |
| Framework     | Vue 3                    | React              |
| Size          | ~5.9KB (JS)              | ~2KB               |
| Tree-shakable | ✅                       | ✅                 |
| Eyedropper    | ✅                       | ❌                 |
| Presets       | ✅                       | ❌                 |
| Dark Mode     | ✅                       | ❌                 |
| Custom Layout | ✅                       | ❌                 |
| Custom Slots  | ✅                       | ❌                 |
| Color Formats | Hex, RGB, HSV, HSL, CMYK | Hex, RGB, HSL, HSV |

## Ecosystem Integrations

`vue3-colorful` provides first-class support for the most popular Vue-based ecosystems.

### Tailwind CSS

Use our official plugin to theme the picker directly from your `tailwind.config.js`.

```js
// tailwind.config.js
import { tailwindPlugin } from 'vue3-colorful/tailwind'

export default {
  theme: {
    vue3Colorful: {
      width: '300px',
      accentColor: '#3b82f6',
      borderRadius: '12px',
    },
  },
  plugins: [tailwindPlugin],
}
```

### UnoCSS

If you use UnoCSS, you can use our dedicated preset.

```ts
// uno.config.ts
import { unocssPreset } from 'vue3-colorful/unocss'

export default defineConfig({
  presets: [unocssPreset()],
  theme: {
    vue3Colorful: {
      width: '320px',
      accentColor: '#ef4444',
    },
  },
})
```

### Nuxt 3

Enjoy seamless auto-imports and built-in CSS injection with our Nuxt module.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue3-colorful/nuxt'],
})
```

## License

MIT
