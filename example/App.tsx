import { computed, defineComponent, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

import {
  CmykColorPicker,
  ColorPicker,
  ColorPickerPopover,
  HexColorPicker,
  HslColorPicker,
  HsvColorPicker,
  RgbColorPicker,
  VERSION,
} from '@/index'
import type { ColorModel } from '@/types'
import { formatColor, parseColor } from '@/utils/converter'

type DemoView = 'showcase' | 'hex' | 'popover' | 'cmyk'

interface DemoNavItem {
  label: string
  value: DemoView
}

interface FormattedValueItem {
  label: string
  value: string
}

interface PointerSlotProps {
  top: number
  left: number
  color: string
}

function getDemoView(): DemoView {
  const view = new URLSearchParams(window.location.search).get('view')

  if (view === 'showcase' || view === 'hex' || view === 'popover' || view === 'cmyk') {
    return view
  }

  return 'showcase'
}

function getViewHref(view: DemoView): string {
  return view === 'showcase' ? '/' : `/?view=${view}`
}

function formatExampleColor(color: string, model: ColorModel, showAlpha: boolean): string {
  try {
    return formatColor(parseColor(color), model, showAlpha)
  } catch {
    return color
  }
}

function getPointerStyle({ top, left, color }: PointerSlotProps): CSSProperties {
  return {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
    backgroundColor: color,
  }
}

export default defineComponent({
  name: 'ExampleApp',
  setup() {
    const view = getDemoView()
    const supportsEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window

    const navItems: DemoNavItem[] = [
      { label: 'Showcase', value: 'showcase' },
      { label: 'Hex Visual', value: 'hex' },
      { label: 'Popover Visual', value: 'popover' },
      { label: 'CMYK Visual', value: 'cmyk' },
    ]
    const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']
    const hexColor = ref('#3b82f6')
    const popoverColor = ref('#8b5cf6')
    const cmykColor = ref('cmyk(0%, 50%, 100%, 0%)')
    const rgbColor = ref('rgba(16, 185, 129, 0.8)')
    const hslColor = ref('hsl(346, 84%, 61%)')
    const hsvColor = ref('hsv(38, 93%, 96%)')

    const playgroundColor = ref('#3b82f6')
    const playgroundModel = ref<ColorModel>('hex')
    const playgroundShowAlpha = ref(false)
    const playgroundShowInput = ref(true)
    const playgroundDark = ref(false)
    const playgroundVertical = ref(false)
    const playgroundShowEyedropper = ref(false)
    const themedColor = ref('#0ea5e9')

    const themeStyle: CSSProperties & Record<string, string> = {
      '--vc-accent-color': '#0ea5e9',
      '--vc-border-radius': '14px',
      '--vc-pointer-size': '24px',
      '--vc-slider-height': '18px',
      '--vc-shadow': '0 14px 30px rgba(14, 165, 233, 0.14)',
      '--vc-preset-active-ring-color': 'rgba(14, 165, 233, 0.26)',
    }
    const themeVariables = Object.entries(themeStyle)

    watch([playgroundModel, playgroundShowAlpha], ([model, showAlpha]) => {
      playgroundColor.value = formatExampleColor(playgroundColor.value, model, showAlpha)
    })

    const hexPreviewStyle = computed<CSSProperties>(() => ({
      backgroundColor: hexColor.value,
    }))

    const playgroundPreviewStyle = computed<CSSProperties>(() => {
      try {
        return {
          backgroundColor: formatColor(parseColor(playgroundColor.value), 'hex', false),
        }
      } catch {
        return {
          backgroundColor: '#111827',
        }
      }
    })

    const formattedValues = computed<FormattedValueItem[]>(() => {
      try {
        const hsva = parseColor(playgroundColor.value)

        return [
          { label: 'HEX', value: formatColor(hsva, 'hex', false) },
          { label: 'RGB(A)', value: formatColor(hsva, 'rgb', playgroundShowAlpha.value) },
          { label: 'HSL(A)', value: formatColor(hsva, 'hsl', playgroundShowAlpha.value) },
          { label: 'HSV(A)', value: formatColor(hsva, 'hsv', playgroundShowAlpha.value) },
          { label: 'CMYK', value: formatColor(hsva, 'cmyk', false) },
        ]
      } catch {
        return [{ label: 'Current Value', value: playgroundColor.value }]
      }
    })

    return () => {
      const hexPanel = (
        <section
          class={['example-app__panel', 'example-app__panel--core']}
          data-testid="hex-picker"
        >
          <div class="example-app__panel-header">
            <h2>Hex Picker</h2>
            <code>{hexColor.value}</code>
          </div>
          <div class="example-app__preview" style={hexPreviewStyle.value} />
          <div class="example-app__picker-demo example-app__picker-demo--tall">
            <HexColorPicker v-model={hexColor.value} presets={presets} showInput colorLabel="HEX" />
          </div>
        </section>
      )

      const popoverPanel = (
        <section
          class={['example-app__panel', 'example-app__panel--core']}
          data-testid="popover-picker"
        >
          <div class="example-app__panel-header">
            <h2>Popover Picker</h2>
            <code>{popoverColor.value}</code>
          </div>
          <p class="example-app__hint">Click the swatch to open the floating picker.</p>
          <ColorPickerPopover v-model={popoverColor.value} showInput />
        </section>
      )

      const cmykPanel = (
        <section
          class={['example-app__panel', 'example-app__panel--core']}
          data-testid="cmyk-picker"
        >
          <div class="example-app__panel-header">
            <h2>CMYK Picker</h2>
            <code>{cmykColor.value}</code>
          </div>
          <CmykColorPicker v-model={cmykColor.value} />
        </section>
      )

      const specializedPanel = (
        <section class={['example-app__panel', 'example-app__panel--group']}>
          <div class="example-app__panel-header">
            <h2>Specialized Pickers</h2>
          </div>
          <p class="example-app__hint">
            Use a dedicated picker when your product stores one stable color format.
          </p>
          <div class="example-app__specialized-grid">
            <div class="example-app__mini-picker">
              <div class="example-app__mini-picker-header">
                <span>HEX</span>
                <code>{hexColor.value}</code>
              </div>
              <div class="example-app__picker-demo example-app__picker-demo--tall">
                <HexColorPicker
                  v-model={hexColor.value}
                  presets={presets}
                  showInput
                  colorLabel="HEX"
                />
              </div>
            </div>

            <div class="example-app__mini-picker">
              <div class="example-app__mini-picker-header">
                <span>RGB + alpha</span>
                <code>{rgbColor.value}</code>
              </div>
              <RgbColorPicker v-model={rgbColor.value} showAlpha />
            </div>

            <div class="example-app__mini-picker">
              <div class="example-app__mini-picker-header">
                <span>HSL</span>
                <code>{hslColor.value}</code>
              </div>
              <HslColorPicker v-model={hslColor.value} />
            </div>

            <div class="example-app__mini-picker">
              <div class="example-app__mini-picker-header">
                <span>HSV</span>
                <code>{hsvColor.value}</code>
              </div>
              <HsvColorPicker v-model={hsvColor.value} />
            </div>

            <div class="example-app__mini-picker">
              <div class="example-app__mini-picker-header">
                <span>CMYK</span>
                <code>{cmykColor.value}</code>
              </div>
              <CmykColorPicker v-model={cmykColor.value} />
            </div>
          </div>
        </section>
      )

      const themePanel = (
        <section class={['example-app__panel', 'example-app__panel--core']}>
          <div class="example-app__panel-header">
            <h2>Custom Theme + Slots</h2>
            <code>{themedColor.value}</code>
          </div>
          <p class="example-app__hint">
            Override CSS variables for branding, then replace the default pointers with your own
            slot content.
          </p>
          <div class="example-app__theme-vars">
            {themeVariables.map(([name, value]) => (
              <div key={name} class="example-app__theme-var">
                <span>{name}</span>
                <code>{value}</code>
              </div>
            ))}
          </div>
          <div class="example-app__picker-demo example-app__picker-demo--theme" style={themeStyle}>
            <HexColorPicker
              v-model={themedColor.value}
              presets={presets}
              showInput
              colorLabel="Theme"
              v-slots={{
                'saturation-pointer': (slotProps: PointerSlotProps) => (
                  <span
                    class="example-app__custom-pointer example-app__custom-pointer--shadow"
                    style={getPointerStyle(slotProps)}
                  />
                ),
                'hue-pointer': (slotProps: PointerSlotProps) => (
                  <span class="example-app__custom-pointer" style={getPointerStyle(slotProps)} />
                ),
                'alpha-pointer': (slotProps: PointerSlotProps) => (
                  <span
                    class="example-app__custom-pointer example-app__custom-pointer--ring"
                    style={getPointerStyle(slotProps)}
                  />
                ),
              }}
            />
          </div>
        </section>
      )

      if (view === 'hex') {
        return <main class="example-app example-app--visual">{hexPanel}</main>
      }

      if (view === 'popover') {
        return <main class="example-app example-app--visual">{popoverPanel}</main>
      }

      if (view === 'cmyk') {
        return <main class="example-app example-app--visual">{cmykPanel}</main>
      }

      return (
        <main class="example-app">
          <header class="example-app__hero">
            <div class="example-app__hero-copy">
              <p class="example-app__eyebrow">vue3-colorful</p>
              <h1>Vue 3 color picker examples</h1>
            </div>
            <div class="example-app__hero-meta">
              <span class="example-app__badge">Version {VERSION}</span>
              <span class="example-app__badge">TSX only</span>
              <span class="example-app__badge">Vue 3</span>
            </div>
          </header>

          <nav class="example-app__nav" aria-label="Example views">
            {navItems.map((item) => (
              <a
                key={item.value}
                href={getViewHref(item.value)}
                class={[
                  'example-app__nav-link',
                  item.value === view && 'example-app__nav-link--active',
                ]}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <section class="example-app__section">
            <div class="example-app__section-header">
              <h2>Playground</h2>
            </div>

            <div class="example-app__showcase">
              <section class={['example-app__panel', 'example-app__panel--playground']}>
                <div class="example-app__panel-header">
                  <div>
                    <h2>Interactive Playground</h2>
                    <p class="example-app__hint">
                      Switch color models and feature flags in one place.
                    </p>
                  </div>
                  <code>{playgroundColor.value}</code>
                </div>

                <div class="example-app__playground">
                  <div class="example-app__controls">
                    <label class="example-app__field">
                      <span>Color model</span>
                      <select
                        value={playgroundModel.value}
                        onChange={(event) => {
                          playgroundModel.value = (event.target as HTMLSelectElement)
                            .value as ColorModel
                        }}
                      >
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                        <option value="hsl">HSL</option>
                        <option value="hsv">HSV</option>
                        <option value="cmyk">CMYK</option>
                      </select>
                    </label>

                    <label class="example-app__toggle">
                      <input
                        type="checkbox"
                        checked={playgroundShowAlpha.value}
                        onChange={(event) => {
                          playgroundShowAlpha.value = (event.target as HTMLInputElement).checked
                        }}
                      />
                      <span>Alpha</span>
                    </label>

                    <label class="example-app__toggle">
                      <input
                        type="checkbox"
                        checked={playgroundShowInput.value}
                        onChange={(event) => {
                          playgroundShowInput.value = (event.target as HTMLInputElement).checked
                        }}
                      />
                      <span>Text input</span>
                    </label>

                    <label class="example-app__toggle">
                      <input
                        type="checkbox"
                        checked={playgroundDark.value}
                        onChange={(event) => {
                          playgroundDark.value = (event.target as HTMLInputElement).checked
                        }}
                      />
                      <span>Dark mode</span>
                    </label>

                    <label class="example-app__toggle">
                      <input
                        type="checkbox"
                        checked={playgroundVertical.value}
                        onChange={(event) => {
                          playgroundVertical.value = (event.target as HTMLInputElement).checked
                        }}
                      />
                      <span>Vertical sliders</span>
                    </label>

                    <label class="example-app__toggle">
                      <input
                        type="checkbox"
                        checked={playgroundShowEyedropper.value}
                        onChange={(event) => {
                          playgroundShowEyedropper.value = (
                            event.target as HTMLInputElement
                          ).checked
                        }}
                      />
                      <span>EyeDropper {supportsEyedropper ? '' : '(unsupported here)'}</span>
                    </label>
                  </div>

                  <div class="example-app__picker-frame">
                    <div class="example-app__preview" style={playgroundPreviewStyle.value} />
                    <div class="example-app__picker-demo example-app__picker-demo--adaptive">
                      <ColorPicker
                        v-model={playgroundColor.value}
                        colorModel={playgroundModel.value}
                        presets={presets}
                        showAlpha={playgroundShowAlpha.value}
                        showInput={playgroundShowInput.value}
                        showEyedropper={playgroundShowEyedropper.value}
                        dark={playgroundDark.value}
                        vertical={playgroundVertical.value}
                        colorLabel={playgroundModel.value.toUpperCase()}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <aside class="example-app__aside">
                <section class={['example-app__panel', 'example-app__panel--aside']}>
                  <div class="example-app__panel-header">
                    <h2>Model Outputs</h2>
                  </div>
                  <p class="example-app__hint">
                    The generic picker keeps one source color and reformats it for whichever model
                    is active.
                  </p>
                  <div class="example-app__value-list">
                    {formattedValues.value.map((item) => (
                      <div key={item.label} class="example-app__value-item">
                        <span>{item.label}</span>
                        <code>{item.value}</code>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </section>

          <section class="example-app__section">
            <div class="example-app__section-header">
              <h2>Examples</h2>
            </div>

            <div class="example-app__examples-grid">
              {specializedPanel}
              <div class="example-app__example-stack">
                {popoverPanel}
                {themePanel}
              </div>
            </div>
          </section>
        </main>
      )
    }
  },
})
