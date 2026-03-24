# vue3-colorful

<p align="center">
A tiny Vue 3 color picker component (~3KB gzipped)
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
- ♿ **Accessibility (a11y)** - Full keyboard navigation and ARIA compliance
- 📚 **Storybook** - Interactive documentation and component testing
- 📦 **Tiny size** - Only ~3KB gzipped
- 🔷 **TypeScript** - Full type support
- ⚡ **Zero dependencies** - No external dependencies except Vue 3
- 🎯 **Vue 3** - Built with Composition API and JSX
- 🌈 **Alpha channel** - Optional transparency support
- 📱 **Responsive** - Modern "Premium" UI with glassmorphism
- 🛠 **Modern Stack** - Powered by Vite 6, Vitest 3, and UnoCSS


## Installation

```bash
# Using pnpm (recommended)
pnpm add vue3-colorful

# Using npm
npm install vue3-colorful

# Using yarn
yarn add vue3-colorful
```

## Basic Usage

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

## Examples

### Hex Color (Default)

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('#ff6600')
</script>

<template>
  <ColorPicker v-model="color" />
  <!-- Output: #ff6600 -->
</template>
```

### RGB with Alpha Channel

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('')
</script>

<template>
  <ColorPicker v-model="color" color-model="rgb" :show-alpha="true" />
  <!-- Output: rgba(255, 102, 0, 0.5) -->
</template>
```

### HSL Color

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('')
</script>

<template>
  <ColorPicker v-model="color" color-model="hsl" />
  <!-- Output: hsl(24, 100%, 50%) -->
</template>
```

### HSV Color

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('')
</script>

<template>
  <ColorPicker v-model="color" color-model="hsv" />
  <!-- Output: hsv(24, 100%, 100%) -->
</template>
```

### CMYK Color

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('')
</script>

<template>
  <ColorPicker v-model="color" color-model="cmyk" />
  <!-- Output: cmyk(0%, 60%, 100%, 0%) -->
</template>
```

### With Event Handling

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('#ff6600')

const handleColorChange = (newColor) => {
  console.log('Color changed to:', newColor)
}
</script>

<template>
  <div>
    <ColorPicker v-model="color" @update:model-value="handleColorChange" />
    <p>Current color: {{ color }}</p>
  </div>
</template>
```

### In a Form

```vue
<script setup>
import { ref } from 'vue'
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const backgroundColor = ref('#ffffff')
const textColor = ref('#000000')
</script>

<template>
  <form>
    <div>
      <label>Background Color:</label>
      <ColorPicker v-model="backgroundColor" />
    </div>
    <div>
      <label>Text Color:</label>
      <ColorPicker v-model="textColor" />
    </div>
    <div :style="{ backgroundColor, color: textColor }">
      Preview text with selected colors
    </div>
  </form>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The color value (v-model) |
| `colorModel` | `'hex' \| 'rgb' \| 'hsv' \| 'hsl' \| 'cmyk'` | `'hex'` | Output color format |
| `showAlpha` | `boolean` | `false` | Show alpha channel slider |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when color changes |

### Supported Color Formats

The component can **parse** and **emit** colors in the following formats:

| Format | Example Input | Example Output |
|--------|---------------|----------------|
| **Hex** | `#ff6600`, `#f60`, `#ff660080` | `#ff6600` |
| **RGB** | `rgb(255, 102, 0)`, `rgba(255, 102, 0, 0.5)` | `rgb(255, 102, 0)` |
| **HSL** | `hsl(24, 100%, 50%)`, `hsla(24, 100%, 50%, 0.5)` | `hsl(24, 100%, 50%)` |
| **HSV** | `hsv(24, 100%, 100%)`, `hsva(24, 100%, 100%, 0.5)` | `hsv(24, 100%, 100%)` |
| **CMYK** | `cmyk(0%, 60%, 100%, 0%)` | `cmyk(0%, 60%, 100%, 0%)` |

## TypeScript

Full type definitions are included:

```typescript
import ColorPicker from 'vue3-colorful'
import type { ColorModel, HsvaColor, RgbaColor, HslaColor, CmykColor } from 'vue3-colorful'
```

### Available Types

```typescript
// Color format types
type ColorModel = 'hex' | 'rgb' | 'hsv' | 'hsl' | 'cmyk'

// Color structure types
interface RgbaColor {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
  a: number // 0-1
}

interface HsvaColor {
  h: number // 0-360
  s: number // 0-100
  v: number // 0-100
  a: number // 0-1
}

interface HslaColor {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
  a: number // 0-1
}

interface CmykColor {
  c: number // 0-100
  m: number // 0-100
  y: number // 0-100
  k: number // 0-100
}
```

### Component Props

```typescript
interface ColorPickerProps {
  modelValue?: string
  colorModel?: ColorModel
  showAlpha?: boolean
}
```

## Browser Support

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Online Demo

You can try vue3-colorful online in the [example directory](./example) or visit the [demo page](https://edonfy.github.io/vue3-colorful/) (if deployed).

## Comparison with react-colorful

| Feature | vue3-colorful | react-colorful |
|---------|---------------|----------------|
| Framework | Vue 3 | React |
| Size | ~3KB | ~2KB |
| Color Formats | Hex, RGB, HSV, HSL, CMYK | Hex, RGB, HSL, HSV |
| TypeScript | ✅ | ✅ |

## License

MIT
