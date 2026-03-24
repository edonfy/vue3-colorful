# vue3-colorful

<p align="center">
A tiny Vue 3 color picker component (~4KB gzipped)
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

- 🎨 **Multiple color formats** - Support for Hex, RGB, HSV, HSL, CMYK
- 🌳 **Tree-shakable** - Specialized components for each color model to minimize bundle size
- ♿ **Accessibility (a11y)** - Full keyboard navigation and ARIA compliance
- 📚 **Storybook** - Interactive documentation and component testing
- 📦 **Tiny size** - Only ~4KB gzipped
- 🌈 **Alpha channel** - Optional transparency support
- 📱 **Responsive** - Modern "Premium" UI with glassmorphism
- 🛠 **Modern Stack** - Powered by Vite 6, Vitest 3, and UnoCSS

## Installation

> [!IMPORTANT]
> This library requires **Node.js 20.x** or higher.

```bash
# Using pnpm (recommended)
pnpm add vue3-colorful

# Using npm
npm install vue3-colorful

# Using yarn
yarn add vue3-colorful
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

## API

### Props

| Prop             | Type         | Default | Description                                |
| ---------------- | ------------ | ------- | ------------------------------------------ |
| `modelValue`     | `string`     | `''`    | The color value (v-model)                  |
| `colorModel`     | `ColorModel` | `'hex'` | Output format (Universal Picker only)      |
| `showAlpha`      | `boolean`    | `false` | Show alpha channel slider                  |
| `showEyedropper` | `boolean`    | `false` | Enable the native EyeDropper tool          |
| `presets`        | `string[]`   | `[]`    | Array of color strings for quick selection |

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
| Size          | ~4KB                     | ~2KB               |
| Tree-shakable | ✅                       | ✅                 |
| Eyedropper    | ✅                       | ❌                 |
| Presets       | ✅                       | ❌                 |
| Color Formats | Hex, RGB, HSV, HSL, CMYK | Hex, RGB, HSL, HSV |

## License

MIT
