import type { Preset } from 'unocss'

/**
 * UnoCSS preset for vue3-colorful
 */
export function presetVue3Colorful(): Preset {
  return {
    name: 'unocss-preset-vue3-colorful',
    preflights: [
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getCSS: ({ theme }: { theme: any }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const config = (theme as any).vue3Colorful as Record<string, string> | undefined
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
