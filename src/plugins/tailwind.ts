import plugin from 'tailwindcss/plugin'

/**
 * Tailwind CSS plugin for vue3-colorful
 *
 * Usage:
 * plugins: [
 *   require('vue3-colorful/plugins/tailwind')
 * ]
 *
 * Theme configuration (tailwind.config.js):
 * theme: {
 *   vue3Colorful: {
 *     width: '300px',
 *     accentColor: '#3b82f6',
 *     borderRadius: '12px',
 *   }
 * }
 */
const vue3ColorfulPlugin: any = plugin(({ addBase, theme }: { addBase: any; theme: any }) => {
  const config = theme('vue3Colorful') as Record<string, string> | undefined

  if (config) {
    const vars: Record<string, string> = {}

    // Mapping theme config to CSS variables
    const mappings: Record<string, string> = {
      width: '--vc-width',
      height: '--vc-height',
      borderRadius: '--vc-border-radius',
      pointerSize: '--vc-pointer-size',
      accentColor: '--vc-accent-color',
      sliderHeight: '--vc-slider-height',
      bgColor: '--vc-bg-color',
      textColor: '--vc-text-color',
      borderColor: '--vc-border-color',
    }

    Object.entries(mappings).forEach(([key, varName]) => {
      if (config[key]) {
        vars[varName] = config[key]
      }
    })

    if (Object.keys(vars).length > 0) {
      addBase({
        '.vue3-colorful': vars,
      })
    }
  }
})

export default vue3ColorfulPlugin
