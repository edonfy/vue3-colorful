import type { Preset } from 'unocss'

/**
 * UnoCSS preset for vue3-colorful
 *
 * Allow users to theme the color picker via UnoCSS theme.
 *
 * Usage in uno.config.ts:
 * import { presetVue3Colorful } from 'vue3-colorful/plugins/unocss'
 *
 * presets: [
 *   presetVue3Colorful()
 * ],
 * theme: {
 *   vue3Colorful: {
 *     width: '300px',
 *     accentColor: '#3b82f6',
 *   }
 * }
 */
export function presetVue3Colorful(): Preset {
  return {
    name: 'unocss-preset-vue3-colorful',
    preflights: [
      {
        getCSS: ({ theme }) => {
          const config = (theme as any).vue3Colorful
          if (config) {
            const vars: string[] = []
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
                vars.push(`${varName}: ${config[key]};`)
              }
            })

            if (vars.length > 0) {
              return `.vue3-colorful { ${vars.join(' ')} }`
            }
          }
          return ''
        },
      },
    ],
  }
}

export default presetVue3Colorful
