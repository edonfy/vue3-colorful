# vue3-colorful `WIP`

<p>
A tiny Vue component for picking colors
</p>

Inspired by [react-colorful](https://omgovich.github.io/react-colorful/)


## Todolist

- [ ] v-model (hex, rgb, hsv, hsl, cmyk)
- [ ] Add support for color string input
- [ ] Typed
- [ ] Better style
- [ ] vitest
- [ ] docs

## Getting Started

```
npm install vue3-colorful
```

```vue
<script setup>
import ColorPicker from 'vue3-colorful'

const color = ref('')
</script>

<template>
<ColorPicker v-model="color" />
</template>

```

## License

MIT
