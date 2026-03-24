import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

/**
 * Nuxt 3 module for vue3-colorful
 *
 * Integration:
 * modules: [
 *   'vue3-colorful/nuxt'
 * ]
 *
 * Options:
 * vue3Colorful: {
 *   // options placeholder
 * }
 */
export default defineNuxtModule({
  meta: {
    name: 'vue3-colorful',
    configKey: 'vue3Colorful',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  setup(options: any, nuxt: any) {
    const { resolve } = createResolver(import.meta.url)

    // Auto-import component list
    const components = [
      'HexColorPicker',
      'RgbColorPicker',
      'HslColorPicker',
      'HsvColorPicker',
      'CmykColorPicker',
      'ColorPicker',
    ]

    components.forEach((name) => {
      addComponent({
        name,
        export: name,
        filePath: 'vue3-colorful',
      })
    })

    // Automatically inject the library's CSS
    nuxt.options.css.push('vue3-colorful/dist/style.css')
  },
})
