import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(options: { disableCss?: boolean } = {}, nuxt: any) {
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
      nuxt.options.css.push(resolve('./vue3-colorful.css'))
    }
  },
})
