import plugin from 'tailwindcss/plugin'

export interface TailwindPluginOptions {
  width?: string
  height?: string
  borderRadius?: string
  pointerSize?: string
  accentColor?: string
  sliderHeight?: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  [key: string]: string | undefined
}

/**
 * Tailwind CSS plugin for vue3-colorful
 */
const vue3ColorfulPlugin = plugin(({ addBase, theme }) => {
  const config = theme('vue3Colorful')

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
      if (config[key] !== undefined && config[key] !== null) {
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

export default vue3ColorfulPlugin as any
