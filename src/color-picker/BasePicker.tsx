import { computed, defineComponent, onUnmounted, PropType, ref } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import Eyedropper from './Eyedropper'
import Presets from './Presets'
import ColorInput from './ColorInput'
import { CopyFormat, HsvaColor, PresetCollectionItem } from '../types'
import { getContrastRatio } from '../utils/contrast'
import { formatColor, isBlankColor } from '../utils/converter'

export default defineComponent({
  name: 'BasePicker',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
    showAlpha: {
      type: Boolean,
      default: false,
    },
    showEyedropper: {
      type: Boolean,
      default: false,
    },
    presets: {
      type: Array as PropType<PresetCollectionItem[]>,
      default: () => [],
    },
    activeColor: {
      type: String, // String representation for the active preset highlight
      default: '',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    colorLabel: {
      type: String,
      default: '',
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    recentColors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    copyFormats: {
      type: Array as PropType<CopyFormat[]>,
      default: () => [],
    },
    showContrast: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'hueChange',
    'hueChangeComplete',
    'alphaChange',
    'alphaChangeComplete',
    'saturationChange',
    'saturationChangeComplete',
    'colorSelect',
    'colorActiveChange',
    'clear',
  ],

  setup(props, { emit, slots }) {
    const copiedFormat = ref<CopyFormat | null>(null)
    let copiedTimer: ReturnType<typeof setTimeout> | null = null

    const contrastInfo = computed(() => {
      if (!props.showContrast || isBlankColor(props.activeColor)) {
        return null
      }

      return {
        white: getContrastRatio(props.activeColor, '#ffffff').toFixed(2),
        black: getContrastRatio(props.activeColor, '#000000').toFixed(2),
      }
    })

    const copyValue = async (format: CopyFormat) => {
      if (
        typeof navigator === 'undefined' ||
        !navigator.clipboard ||
        props.disabled ||
        props.readOnly ||
        isBlankColor(props.activeColor)
      ) {
        return
      }

      const text = formatColor(props.hsva, format, props.showAlpha)
      await navigator.clipboard.writeText(text)
      copiedFormat.value = format

      if (copiedTimer) {
        clearTimeout(copiedTimer)
      }

      copiedTimer = setTimeout(() => {
        copiedFormat.value = null
      }, 1200)
    }

    onUnmounted(() => {
      if (copiedTimer) {
        clearTimeout(copiedTimer)
      }
    })

    return () => (
      <div
        class={[
          'vue3-colorful',
          {
            'vue3-colorful--dark': props.dark,
            'vue3-colorful--vertical': props.vertical,
            'vue3-colorful--disabled': props.disabled,
            'vue3-colorful--readonly': props.readOnly,
          },
        ]}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-readonly={props.readOnly ? 'true' : undefined}
      >
        <div class={['vue3-colorful__body', { 'vue3-colorful__body--vertical': props.vertical }]}>
          <Saturation
            hsva={props.hsva}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={(val: { s: number; v: number }) => emit('saturationChange', val)}
            onChangeComplete={() => emit('saturationChangeComplete')}
            v-slots={{
              pointer: slots['saturation-pointer'],
              track: slots['saturation-track'],
            }}
          ></Saturation>
          <Hue
            hue={props.hsva.h}
            vertical={props.vertical}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={(val: number) => emit('hueChange', val)}
            onChangeComplete={() => emit('hueChangeComplete')}
            v-slots={{
              pointer: slots['hue-pointer'],
              track: slots['hue-track'],
            }}
          />
          {props.showAlpha && (
            <Alpha
              hsva={props.hsva}
              vertical={props.vertical}
              disabled={props.disabled}
              readOnly={props.readOnly}
              onChange={(val: number) => emit('alphaChange', val)}
              onChangeComplete={() => emit('alphaChangeComplete')}
              v-slots={{
                pointer: slots['alpha-pointer'],
                track: slots['alpha-track'],
              }}
            />
          )}
          {props.showEyedropper && (
            <Eyedropper
              disabled={props.disabled}
              readOnly={props.readOnly}
              onSelect={(color) => emit('colorSelect', color)}
            ></Eyedropper>
          )}
        </div>
        {props.showInput && (
          <ColorInput
            modelValue={props.activeColor}
            label={props.colorLabel}
            disabled={props.disabled}
            readOnly={props.readOnly}
            editable={props.editable}
            clearable={props.clearable}
            onActive-change={(val: string) => emit('colorActiveChange', val)}
            onUpdate:modelValue={(val: string) => emit('colorSelect', val)}
            onClear={() => emit('clear')}
          />
        )}
        {!props.showInput && props.clearable && (
          <div class="vue3-colorful__actions">
            <button
              type="button"
              class="vue3-colorful__clear"
              onClick={() => emit('clear')}
              disabled={props.disabled || props.readOnly}
              aria-label="Clear color"
            >
              Clear
            </button>
          </div>
        )}
        {(props.copyFormats.length > 0 || contrastInfo.value) && (
          <div class="vue3-colorful__info">
            {props.copyFormats.length > 0 && (
              <div class="vue3-colorful__copy-actions">
                {props.copyFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    class={[
                      'vue3-colorful__copy-button',
                      copiedFormat.value === format && 'vue3-colorful__copy-button--copied',
                    ]}
                    disabled={props.disabled || props.readOnly || isBlankColor(props.activeColor)}
                    onClick={() => void copyValue(format)}
                    aria-label={
                      copiedFormat.value === format
                        ? `${format.toUpperCase()} value copied`
                        : `Copy ${format.toUpperCase()} value`
                    }
                  >
                    <span class="vue3-colorful__copy-button-label">
                      {copiedFormat.value === format
                        ? `${format.toUpperCase()} Copied`
                        : `Copy ${format.toUpperCase()}`}
                    </span>
                  </button>
                ))}
                <span class="vue3-colorful__sr-only" aria-live="polite">
                  {copiedFormat.value ? `${copiedFormat.value.toUpperCase()} value copied` : ''}
                </span>
              </div>
            )}
            {contrastInfo.value && (
              <div class="vue3-colorful__contrast">
                <span class="vue3-colorful__contrast-title">Contrast</span>
                <span class="vue3-colorful__contrast-item">White {contrastInfo.value.white}</span>
                <span class="vue3-colorful__contrast-item">Black {contrastInfo.value.black}</span>
              </div>
            )}
          </div>
        )}
        {(props.presets.length > 0 || props.recentColors.length > 0) && (
          <Presets
            presets={props.presets}
            recentColors={props.recentColors}
            activeColor={props.activeColor}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onSelect={(color) => emit('colorSelect', color)}
          ></Presets>
        )}
      </div>
    )
  },
})
