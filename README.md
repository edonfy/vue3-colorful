# vue3-colorful `WIP`

<p>
A tiny Vue component for picking colors
</p>

Inspired by [react-colorful](https://omgovich.github.io/react-colorful/)


## Todolist

- [x] v-model (hex, rgb, hsv, hsl, cmyk)
- [x] Add support for color string input
- [x] Typed
- [ ] Better style
- [x] vitest
- [ ] docs

## Getting Started

```
npm install vue3-colorful
```

```vue
<script setup>
import ColorPicker from 'vue3-colorful'
import 'vue3-colorful/dist/style.css'

const color = ref('')
</script>

<template>
<ColorPicker v-model="color" />
</template>

```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The color value in the format specified by `colorModel`. |
| `colorModel` | `'hex' \| 'rgb' \| 'hsv' \| 'hsl' \| 'cmyk'` | `'hex'` | The color model for `modelValue`. |
| `showAlpha` | `boolean` | `false` | Whether to show the alpha slider. |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the color changes. The payload is the color string in the format specified by `colorModel`. |

### Supported Color Formats

The component can parse and emit colors in the following formats:
- **Hex**: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
- **RGB**: `rgb(r, g, b)`, `rgba(r, g, b, a)`
- **HSL**: `hsl(h, s%, l%)`, `hsla(h, s%, l%, a)`
- **HSV**: `hsv(h, s%, v%)`, `hsva(h, s%, v%, a)`
- **CMYK**: `cmyk(c%, m%, y%, k%)`

## License

MIT
