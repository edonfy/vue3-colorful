import { computed, defineComponent, onUnmounted, PropType, ref } from 'vue'
import { CopyFormat, HsvaColor } from '../types'
import { getContrastRatio } from '../utils/contrast'
import { formatColor, isBlankColor } from '../utils/converter'

export default defineComponent({
  name: 'PickerInfo',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
    activeColor: {
      type: String,
      default: '',
    },
    showAlpha: {
      type: Boolean,
      default: false,
    },
    copyFormats: {
      type: Array as PropType<CopyFormat[]>,
      default: () => [],
    },
    showContrast: {
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
  },

  setup(props) {
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

      try {
        await navigator.clipboard.writeText(text)
        copiedFormat.value = format

        if (copiedTimer) {
          clearTimeout(copiedTimer)
        }

        copiedTimer = setTimeout(() => {
          copiedFormat.value = null
        }, 1200)
      } catch (error) {
        if (
          typeof process !== 'undefined' &&
          process.env &&
          process.env.NODE_ENV !== 'production'
        ) {
          console.warn('[vue3-colorful] Failed to copy color value', error)
        }
      }
    }

    onUnmounted(() => {
      if (copiedTimer) {
        clearTimeout(copiedTimer)
      }
    })

    return () => {
      if (props.copyFormats.length === 0 && !contrastInfo.value) {
        return null
      }

      return (
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
      )
    }
  },
})
