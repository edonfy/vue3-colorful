import plugin from 'tailwindcss/plugin'

/**
 * Tailwind CSS plugin for vue3-colorful
 */
const vue3ColorfulPlugin = plugin(({ addBase, theme }) => {
  const config = theme('vue3Colorful') as Record<string, string> | undefined

  if (config) {
    const vars: Record<string, string> = {}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default vue3ColorfulPlugin as any
