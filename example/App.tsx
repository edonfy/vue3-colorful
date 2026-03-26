import { computed, defineComponent, ref } from 'vue'
import type { CSSProperties } from 'vue'

import {
  CmykColorPicker,
  ColorPicker,
  ColorPickerPanel,
  ColorPickerPopover,
  HexColorInput,
  HexColorPicker,
  HslColorPicker,
  HsvColorPicker,
  HwbColorPicker,
  RgbColorPicker,
  VERSION,
} from '@/index'
import type { ColorModel } from '@/types'
import { formatColor, parseColor } from '@/utils/converter'

type DemoView = 'showcase' | 'hex' | 'popover' | 'cmyk' | 'panel' | 'disabled'

const GITHUB_REPO_URL = 'https://github.com/edonfy/vue3-colorful'

function getDemoView(): DemoView {
  if (typeof window === 'undefined') {
    return 'showcase'
  }

  const view = new URLSearchParams(window.location.search).get('view')
  if (
    view === 'hex' ||
    view === 'popover' ||
    view === 'cmyk' ||
    view === 'panel' ||
    view === 'disabled'
  ) {
    return view
  }

  return 'showcase'
}

interface PointerSlotProps {
  top: number
  left: number
  color: string
}

// --- Utilities ---

const copyToClipboard = async (text: string, target?: HTMLElement | null) => {
  try {
    await navigator.clipboard.writeText(text)
    const el = target ?? document.querySelector('.master-showcase__preview-value')
    if (el) {
      el.classList.add('copied')
      setTimeout(() => el.classList.remove('copied'), 1000)
    }
  } catch {
    console.warn('[vue3-colorful] Failed to copy example value')
  }
}

// --- Components ---

const Badge = ({ text }: { text: string }) => <span class="demo-hero__badge">{text}</span>

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div class="demo-section__header">
    <h2 class="demo-section__title">{title}</h2>
    <p class="demo-section__description">{description}</p>
  </div>
)

const renderPickerCard = (title: string, modelValue: string, content: JSX.Element) => (
  <div class="picker-card">
    <div class="picker-card__header">
      <span class="picker-card__title">{title}</span>
      <code
        class="picker-card__code"
        onClick={(event) => copyToClipboard(modelValue, event.currentTarget as HTMLElement)}
      >
        {modelValue}
      </code>
    </div>
    {content}
  </div>
)

// --- Main App ---

export default defineComponent({
  name: 'ExampleApp',
  setup() {
    const view = getDemoView()
    const supportsEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window

    // --- State ---
    const masterColor = ref('#6366f1')
    const masterModel = ref<ColorModel>('hex')
    const masterShowAlpha = ref(false)
    const masterShowInput = ref(true)
    const masterDark = ref(false)
    const masterVertical = ref(false)
    const masterShowEyedropper = ref(true)

    const hexColor = ref('#3b82f6')
    const rgbColor = ref('rgba(16, 185, 129, 0.8)')
    const hslColor = ref('hsl(346, 84%, 61%)')
    const hsvColor = ref('hsv(38, 93%, 96%)')
    const hwbColor = ref('hwb(38 0% 4%)')
    const cmykColor = ref('cmyk(0%, 50%, 100%, 0%)')
    const popoverColor = ref('#8b5cf6')
    const hexInputColor = ref('#3b82f6')

    const themedColor = ref('#ec4899')

    const groupedPresets = [
      {
        label: 'Brand',
        colors: [
          { label: 'Primary', value: '#6366f1' },
          { label: 'Accent', value: '#ec4899' },
        ],
      },
      {
        label: 'System',
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      },
    ]

    // --- Computed ---
    const masterPreviewStyle = computed<CSSProperties>(() => {
      try {
        const hsva = parseColor(masterColor.value)
        return {
          backgroundColor: formatColor(hsva, 'hex', false),
        }
      } catch {
        return { backgroundColor: '#000' }
      }
    })

    // --- Methods ---
    const updateMasterModel = (e: Event) => {
      masterModel.value = (e.target as HTMLSelectElement).value as ColorModel
    }

    return () => {
      const hexPanel = (
        <section data-testid="hex-picker">
          <HexColorPicker
            v-model={hexColor.value}
            presets={groupedPresets}
            showInput
            showRecent
            copyFormats={['hex', 'rgb']}
            showContrast
            colorLabel="HEX"
            style={{ '--vc-height': '268px' }}
          />
        </section>
      )

      const cmykPanel = (
        <section data-testid="cmyk-picker">
          <CmykColorPicker v-model={cmykColor.value} />
        </section>
      )

      const popoverPanel = (
        <section class="demo-popover-visual">
          <ColorPickerPopover v-model={popoverColor.value} showInput />
        </section>
      )

      const clearablePanel = (
        <section data-testid="panel-picker">
          <ColorPickerPanel v-model={hexColor.value} showInput clearable colorLabel="HEX" />
        </section>
      )

      const disabledPanel = (
        <section data-testid="disabled-picker">
          <HexColorPicker
            v-model={hexColor.value}
            showInput
            clearable
            disabled
            presets={groupedPresets}
            colorLabel="HEX"
          />
        </section>
      )

      if (view === 'hex') {
        return <div class={['demo-container', 'demo-container--visual']}>{hexPanel}</div>
      }

      if (view === 'cmyk') {
        return <div class={['demo-container', 'demo-container--visual']}>{cmykPanel}</div>
      }

      if (view === 'popover') {
        return <div class={['demo-container', 'demo-container--visual']}>{popoverPanel}</div>
      }

      if (view === 'panel') {
        return <div class={['demo-container', 'demo-container--visual']}>{clearablePanel}</div>
      }

      if (view === 'disabled') {
        return <div class={['demo-container', 'demo-container--visual']}>{disabledPanel}</div>
      }

      return (
        <div class="demo-container" style="position: relative;">
          <div class="demo-hero__badges">
            <Badge text={`v${VERSION} • Vue 3 • TSX`} />
            <a
              class="demo-hero__badge-link"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          <header class="demo-hero">
            <h1 class="demo-hero__title">vue3-colorful</h1>
            <p class="demo-hero__subtitle">
              A tiny, modular, and accessible color picker component for Vue 3. Built with
              performance and developer experience in mind.
            </p>
          </header>

          <section class="demo-section">
            <SectionHeader
              title="Interactive Playground"
              description="Experience the full power of vue3-colorful. Toggle features, switch color models, and see how it fits your needs."
            />

            <div class="master-showcase">
              <div class="master-showcase__preview-container">
                <div class="master-showcase__preview-box" style={masterPreviewStyle.value}>
                  <div
                    class="master-showcase__preview-value"
                    onClick={(event) =>
                      copyToClipboard(masterColor.value, event.currentTarget as HTMLElement)
                    }
                  >
                    {masterColor.value}
                  </div>
                </div>

                <div class="master-showcase__controls">
                  <div class="control-group">
                    <label>Color Model</label>
                    <select value={masterModel.value} onChange={updateMasterModel}>
                      <option value="hex">HEX</option>
                      <option value="rgb">RGB</option>
                      <option value="hsl">HSL</option>
                      <option value="hsv">HSV</option>
                      <option value="hwb">HWB</option>
                      <option value="cmyk">CMYK</option>
                    </select>
                  </div>

                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model={masterShowAlpha.value} />
                      Alpha
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" v-model={masterShowInput.value} />
                      Input
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" v-model={masterDark.value} />
                      Dark Mode
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" v-model={masterVertical.value} />
                      Vertical
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" v-model={masterShowEyedropper.value} />
                      Eyedropper {supportsEyedropper ? '' : '(unsupported)'}
                    </label>
                  </div>
                </div>
              </div>

              <div class="master-showcase__picker-container">
                <ColorPicker
                  class="master-showcase__picker"
                  v-model={masterColor.value}
                  colorModel={masterModel.value}
                  showAlpha={masterShowAlpha.value}
                  showInput={masterShowInput.value}
                  dark={masterDark.value}
                  vertical={masterVertical.value}
                  showEyedropper={masterShowEyedropper.value}
                  presets={groupedPresets}
                  showRecent
                  copyFormats={['hex', 'rgb', 'hsl']}
                  showContrast
                  style={{
                    '--vc-height': masterVertical.value ? '300px' : '350px',
                    width: masterVertical.value ? 'auto' : '100%',
                  }}
                />
              </div>
            </div>
          </section>

          <section class="demo-section">
            <SectionHeader
              title="Specialized Components"
              description="Use targeted components when you only need a specific format. They are even lighter and more focused."
            />

            <div class="picker-grid">
              {renderPickerCard(
                'Hex Picker',
                hexColor.value,
                <HexColorPicker v-model={hexColor.value} style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'RGB Picker',
                rgbColor.value,
                <RgbColorPicker v-model={rgbColor.value} showAlpha style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'HSL Picker',
                hslColor.value,
                <HslColorPicker v-model={hslColor.value} style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'HSV Picker',
                hsvColor.value,
                <HsvColorPicker v-model={hsvColor.value} style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'HWB Picker',
                hwbColor.value,
                <HwbColorPicker v-model={hwbColor.value} style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'CMYK Picker',
                cmykColor.value,
                <CmykColorPicker v-model={cmykColor.value} style={{ width: '100%' }} />
              )}

              {renderPickerCard(
                'Popover Mode',
                popoverColor.value,
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--demo-bg); border-radius: 1rem;">
                  <ColorPickerPopover v-model={popoverColor.value} showInput />
                  <span style="font-size: 0.875rem; font-weight: 500;">Click swatch to open</span>
                </div>
              )}

              {renderPickerCard(
                'Hex Input',
                hexInputColor.value,
                <div style="padding: 1rem; background: var(--demo-bg); border-radius: 1rem;">
                  <HexColorInput v-model={hexInputColor.value} clearable />
                </div>
              )}
            </div>
          </section>

          <section class="demo-section">
            <SectionHeader
              title="Theming & Customization"
              description="Fully brandable via CSS variables and highly customizable with slots. Replace any part of the UI with your own components."
            />

            <div class="theming-container">
              <div class="theme-info">
                <h3 style="margin-top: 0; font-size: 1.125rem;">CSS Variables</h3>
                <p style="color: var(--demo-text-muted); font-size: 0.875rem; margin-bottom: 2rem;">
                  Customize the look and feel by overriding the default CSS variables in your
                  styles.
                </p>
                <pre style="background: var(--demo-bg); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--demo-card-border); font-size: 0.875rem; color: var(--demo-accent); overflow-x: auto;">
                  {`.vue3-colorful {
  --vc-accent-color: #ec4899;
  --vc-border-radius: 20px;
  --vc-pointer-size: 32px;
  --vc-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2);
}`}
                </pre>
              </div>

              <div class="theme-preview">
                <HexColorPicker
                  v-model={themedColor.value}
                  showInput
                  style={{
                    '--vc-accent-color': '#ec4899',
                    '--vc-border-radius': '20px',
                    '--vc-pointer-size': '32px',
                    '--vc-shadow': '0 10px 15px -3px rgba(236, 72, 153, 0.2)',
                    width: '100%',
                    height: '300px',
                  }}
                  v-slots={{
                    'saturation-pointer': ({ top, left, color }: PointerSlotProps) => (
                      <div
                        class="custom-pointer"
                        style={{ top: `${top * 100}%`, left: `${left * 100}%`, borderColor: color }}
                      />
                    ),
                    'hue-pointer': ({ top, left }: PointerSlotProps) => (
                      <div
                        class="custom-pointer custom-pointer--hue"
                        style={{ top: `${top * 100}%`, left: `${left * 100}%` }}
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </section>

          <footer style="margin-top: 4rem; text-align: center; color: var(--demo-text-muted); font-size: 0.875rem;">
            <p>© 2024 vue3-colorful • MIT Licensed</p>
          </footer>
        </div>
      )
    }
  },
})
