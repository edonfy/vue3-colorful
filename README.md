# vue3-colorful

<p align="center">
A tiny Vue 3 color picker component (~3KB gzipped)
</p>

<p align="center">
Inspired by <a href="https://omgovich.github.io/react-colorful/">react-colorful</a>
</p>

## Features

- 🎨 **Multiple color formats** - Support for Hex, RGB, HSV, HSL, CMYK
- 📦 **Tiny size** - Only ~3KB gzipped
- 🔷 **TypeScript** - Full type support
- ⚡ **Zero dependencies** - No external dependencies except Vue 3
- 🎯 **Vue 3** - Built with Composition API and JSX

## Installation

```bash
npm install vue3-colorful
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
import type { ColorModel, HsvaColor, RgbaColor } from 'vue3-colorful'
```

## Browser Support

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Comparison with react-colorful

| Feature | vue3-colorful | react-colorful |
|---------|---------------|----------------|
| Framework | Vue 3 | React |
| Size | ~3KB | ~2KB |
| Color Formats | Hex, RGB, HSV, HSL, CMYK | Hex, RGB, HSL, HSV |
| TypeScript | ✅ | ✅ |

## License

MIT
