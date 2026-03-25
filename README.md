# vue3-colorful 🎨

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-colorful"><img src="https://img.shields.io/npm/v/vue3-colorful" alt="npm version"></a>
  <a href="https://github.com/edonfy/vue3-colorful/actions"><img src="https://github.com/edonfy/vue3-colorful/workflows/CI/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/coverage-94%25-green" alt="Coverage">
  <img src="https://img.shields.io/badge/gzipped-~7KB-blue" alt="Size">
</p>

<p align="center">
  <a href="https://edonfy.github.io/vue3-colorful/"><strong>Live Demo</strong></a>
</p>

A tiny, fast, and accessible color picker component for Vue 3. Highly optimized and modernized with premium aesthetics and first-class ecosystem support.

---

## 🌟 Key Features

- 🌳 **Tree-shakable** - Import only the models you need (Hex, RGB, HSL, HSV, CMYK).
- ♿ **Accessible** - Full ARIA support and comprehensive keyboard navigation.
- 🌓 **Dark Mode** - Built-in premium dark theme with simple toggle.
- 🚀 **Performant** - Ultra-smooth 60fps interactions via RAF throttling and LRU caching.
- ✅ **Industrial Stability** - Automated Visual Regression & 100+ Unit tests.

---

## 🚀 Installation

```bash
# Using pnpm (recommended)
pnpm add vue3-colorful

# Using npm
npm install vue3-colorful
```

---

## 📦 Components

### Specialized Pickers (Recommended)

For the best bundle size, import the specific component for your color model.

```vue
<script setup>
import { ref } from 'vue'
import { HexColorPicker } from 'vue3-colorful'
import 'vue3-colorful/dist/vue3-colorful.css'

const color = ref('#3b82f6')
</script>

<template>
  <HexColorPicker v-model="color" />
</template>
```

**Available**: `HexColorPicker`, `RgbColorPicker`, `HslColorPicker`, `HsvColorPicker`, `CmykColorPicker`.

All specialized pickers share the same [props](#-props) and [slots](#-slots).

### Generic ColorPicker

A flexible component that supports switching between color models at runtime.

```vue
<script setup>
import { ref } from 'vue'
import { ColorPicker } from 'vue3-colorful'
import 'vue3-colorful/dist/vue3-colorful.css'

const color = ref('#3b82f6')
</script>

<template>
  <ColorPicker v-model="color" color-model="rgb" />
</template>
```

| Prop         | Type                                         | Default | Description        |
| ------------ | -------------------------------------------- | ------- | ------------------ |
| `colorModel` | `'hex' \| 'rgb' \| 'hsl' \| 'hsv' \| 'cmyk'` | `'hex'` | Active color model |

Additionally accepts all [common props](#-props).

### Popover Mode （support with `@floating-ui`）

A compact floating picker that opens on click, powered by `@floating-ui`.

```vue
<script setup>
import { ref } from 'vue'
import { ColorPickerPopover } from 'vue3-colorful'
import 'vue3-colorful/dist/vue3-colorful.css'

const color = ref('#3b82f6')
</script>

<template>
  <!-- Basic usage with built-in trigger -->
  <ColorPickerPopover v-model="color" show-input />
</template>
```

**Custom trigger via default slot:**

```vue
<ColorPickerPopover v-model="color" show-input>
  <template #default="{ isOpen, color }">
    <button>Custom Trigger (Current: {{ color }})</button>
  </template>
</ColorPickerPopover>
```

Scoped slot data:

| Binding  | Type      | Description                 |
| -------- | --------- | --------------------------- |
| `isOpen` | `boolean` | Whether the popover is open |
| `color`  | `string`  | Current color value         |

Additionally accepts all [common props](#-props).

---

## 🛠️ Props

All pickers (Specialized, Generic, and Popover) accept the following props:

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

---

## 🎰 Slots

All pickers support the following named slots for custom pointers and track backgrounds:

| Slot                 | Scope                  | Description                    |
| -------------------- | ---------------------- | ------------------------------ |
| `saturation-pointer` | `{ top, left, color }` | Custom pointer in 2D area      |
| `saturation-track`   | —                      | Custom track background        |
| `hue-pointer`        | `{ left, top, color }` | Custom pointer on hue slider   |
| `hue-track`          | —                      | Custom hue slider background   |
| `alpha-pointer`      | `{ left, top, color }` | Custom pointer on alpha slider |
| `alpha-track`        | —                      | Custom alpha slider background |

---

## 🎨 Customization

### CSS Variables

Override these variables to theme the picker globally:

| Variable             | Default               |
| -------------------- | --------------------- |
| `--vc-width`         | `200px`               |
| `--vc-height`        | `200px`               |
| `--vc-border-radius` | `8px`                 |
| `--vc-pointer-size`  | `28px`                |
| `--vc-slider-height` | `24px`                |
| `--vc-accent-color`  | `#3b82f6`             |
| `--vc-bg-color`      | `#fff`                |
| `--vc-border-color`  | `rgba(0, 0, 0, 0.05)` |
| `--vc-preset-gap`    | `8px`                 |

```css
.vue3-colorful {
  --vc-accent-color: #8b5cf6;
  --vc-border-radius: 12px;
}
```

### Dark Mode

Enable via the `dark` prop — no CSS import needed:

```vue
<HexColorPicker v-model="color" dark />
```

This applies the `.vue3-colorful--dark` class, which uses dark-themed colors defined in the bundled stylesheet.

---

## ♿ Accessibility

### Keyboard Navigation

| Shortcut              | Action                           |
| --------------------- | -------------------------------- |
| `Arrow Keys`          | Move pointer in 1% increments    |
| `Shift + Arrow`       | Move in 10% increments           |
| `Home` / `End`        | Move to minimum / maximum values |
| `PageUp` / `PageDown` | Move in large increments         |
| `Tab`                 | Focus between sliders and input  |

### ARIA Support

All interactive elements include proper ARIA attributes:

- Sliders use `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Inputs use `role="textbox"` with `aria-label` and `aria-invalid`
- Popover trigger uses `aria-haspopup` and `aria-expanded`

### EyeDropper

The EyeDropper button uses the native [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API). When unsupported (Firefox, Safari), the button is disabled with a tooltip explaining the limitation. No polyfill required.

---

## 🧩 Ecosystem Integration

### Tailwind CSS

Automatically maps your Tailwind theme config to CSS variables.

```js
// tailwind.config.js
import tailwindPlugin from 'vue3-colorful/tailwind'

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

Auto-imports all components and injects CSS.

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

Generates utility classes for picker theming.

```ts
// uno.config.ts
import { presetVue3Colorful } from 'vue3-colorful/unocss'

export default defineConfig({
  presets: [presetVue3Colorful()],
})
```

---

## 💻 Browser Compatibility

- **Vue**: ^3.2.0
- **Modern Browsers**: Chrome, Firefox, Safari, Edge.
- **EyeDropper API**: Chromium-based only (Chrome, Edge, Opera). Graceful fallback elsewhere.

---

## ❓ Troubleshooting

**Styles not appearing:**
Ensure you import the CSS file in your main entry point:

```js
import 'vue3-colorful/dist/vue3-colorful.css'
```

**Nuxt 3 SSR errors:**
Ensure the module is added to `nuxt.config.ts` modules array as shown in the [Ecosystem](#nuxt-3) section.

---

## License

MIT (c) 2024-present edonfy
