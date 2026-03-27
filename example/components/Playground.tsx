import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { ColorPicker } from '@/index'
import type { ColorModel } from '@/types'
import { formatColor, parseColor } from '@/utils/converter'
import { COLOR_MODELS, GROUPED_PRESETS } from '../constants'
import CodeBlock from './CodeBlock'

export default defineComponent({
  name: 'Playground',
  setup() {
    const color = ref('#6366f1')
    const colorModel = ref<ColorModel>('hex')
    const showAlpha = ref(false)
    const showInput = ref(true)
    const dark = ref(false)
    const vertical = ref(false)
    const showEyedropper = ref(true)
    const supportsEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window

    const syncTheme = (isDark: boolean) => {
      if (typeof document === 'undefined') return
      document.body.classList.toggle('demo-body--dark', isDark)
    }

    onMounted(() => {
      syncTheme(dark.value)
    })

    watch(dark, (isDark) => {
      syncTheme(isDark)
    })

    onUnmounted(() => {
      if (typeof document === 'undefined') return
      document.body.classList.remove('demo-body--dark')
    })

    const previewStyle = computed<CSSProperties>(() => {
      try {
        const hsva = parseColor(color.value)
        return { backgroundColor: formatColor(hsva, 'hex', false) }
      } catch {
        return { backgroundColor: '#000' }
      }
    })

    const generatedCode = computed(() => {
      const props: string[] = [`v-model={color.value}`]
      if (colorModel.value !== 'hex') props.push(`colorModel="${colorModel.value}"`)
      if (showAlpha.value) props.push('showAlpha')
      if (showInput.value) props.push('showInput')
      if (dark.value) props.push('dark')
      if (vertical.value) props.push('vertical')
      if (showEyedropper.value) props.push('showEyedropper')
      return `<ColorPicker\n  ${props.join('\n  ')}\n/>`
    })

    const copyColor = async () => {
      try {
        await navigator.clipboard.writeText(color.value)
      } catch {
        console.warn('[vue3-colorful] Failed to copy color')
      }
    }

    const updateModel = (e: Event) => {
      colorModel.value = (e.target as HTMLSelectElement).value as ColorModel
    }

    return () => (
      <section id="playground" class="playground">
        <h2 class="section-title">Interactive Playground</h2>
        <p class="section-description">
          Toggle features, switch color models, and see how it fits your needs.
        </p>

        <div class="playground__grid">
          <div class="playground__controls">
            <div class="playground__preview" style={previewStyle.value}>
              <button class="playground__preview-value" onClick={copyColor}>
                {color.value}
              </button>
            </div>

            <div class="playground__control-group">
              <label class="playground__label">Color Model</label>
              <select class="playground__select" value={colorModel.value} onChange={updateModel}>
                {COLOR_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div class="playground__checkboxes">
              <label class="playground__checkbox">
                <input type="checkbox" v-model={showAlpha.value} />
                Alpha
              </label>
              <label class="playground__checkbox">
                <input type="checkbox" v-model={showInput.value} />
                Input
              </label>
              <label class="playground__checkbox">
                <input type="checkbox" v-model={dark.value} />
                Dark Mode
              </label>
              <label class="playground__checkbox">
                <input type="checkbox" v-model={vertical.value} />
                Vertical
              </label>
              <label class="playground__checkbox">
                <input type="checkbox" v-model={showEyedropper.value} />
                Eyedropper{!supportsEyedropper ? ' (unsupported)' : ''}
              </label>
            </div>
          </div>

          <div class="playground__picker-area">
            <ColorPicker
              class="playground__picker"
              v-model={color.value}
              colorModel={colorModel.value}
              showAlpha={showAlpha.value}
              showInput={showInput.value}
              dark={dark.value}
              vertical={vertical.value}
              showEyedropper={showEyedropper.value}
              presets={GROUPED_PRESETS}
              showRecent
              copyFormats={['hex', 'rgb', 'hsl']}
              showContrast
              style={{
                '--vc-height': vertical.value ? '300px' : '350px',
                width: vertical.value ? 'auto' : '100%',
              }}
            />
          </div>
        </div>

        <div class="playground__code">
          <CodeBlock code={generatedCode.value} language="tsx" />
        </div>
      </section>
    )
  },
})
