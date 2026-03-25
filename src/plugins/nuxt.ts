import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

interface NuxtApp {
  options: {
    css: string[]
  }
}

/**
 * Nuxt 3 module for vue3-colorful
 */
export default defineNuxtModule({
  meta: {
    name: 'vue3-colorful',
    configKey: 'vue3Colorful',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  setup(options: { disableCss?: boolean } = {}, nuxt: unknown) {
    const _nuxt = nuxt as NuxtApp
    const { resolve } = createResolver(import.meta.url)

    // Auto-import component list
    const components = [
      'HexColorPicker',
      'RgbColorPicker',
      'HslColorPicker',
      'HsvColorPicker',
      'CmykColorPicker',
      'ColorPicker',
      'ColorPickerPopover',
    ]

    components.forEach((name) => {
      addComponent({
        name,
        export: name,
        filePath: 'vue3-colorful',
      })
    })

    // Automatically inject the library's CSS relative to this file
    if (!options.disableCss) {
      // In production, the CSS file is named vue3-colorful.css
      _nuxt.options.css.push(resolve('./vue3-colorful.css'))
    }
  },
})
