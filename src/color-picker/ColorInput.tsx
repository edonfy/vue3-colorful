import { defineComponent, ref, watch, onUnmounted, PropType } from 'vue'
import { ColorPickerLabels } from '../types'
import { isBlankColor, parseColor } from '../utils/converter'
import { hexToHsva } from '../utils/convert'
import { getColorPickerLabel } from './labels'

export default defineComponent({
  name: 'ColorInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labels: {
      type: Object as PropType<Partial<ColorPickerLabels>>,
      default: () => ({}),
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
    consumeBlurCommitSuppression: {
      type: Function as PropType<() => boolean>,
      default: undefined,
    },
    format: {
      type: String as PropType<'color' | 'hex'>,
      default: 'color',
    },
  },
  emits: ['update:modelValue', 'active-change', 'clear', 'focus', 'blur'],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue)
    const isInvalid = ref(false)
    const lastCommittedValue = ref(props.modelValue)
    const lastActiveValue = ref(props.modelValue)
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const isInputReadOnly = () => props.readOnly || !props.editable

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== internalValue.value) {
          internalValue.value = newVal
          isInvalid.value = false
          lastCommittedValue.value = newVal
          lastActiveValue.value = newVal
        }
      }
    )

    onUnmounted(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
    })

    const normalizeInputValue = (value: string): string => {
      const trimmed = value.trim()

      if (props.format === 'hex' && /^[0-9a-fA-F]{3,8}$/.test(trimmed)) {
        return `#${trimmed}`
      }

      return trimmed
    }

    const validateInputValue = (value: string) => {
      if (props.format === 'hex') {
        const normalizedValue = normalizeInputValue(value)
        if (!/^#[0-9a-fA-F]{3,8}$/.test(normalizedValue)) {
          throw new Error(`Invalid HEX color: ${value}`)
        }
        hexToHsva(normalizedValue)
        return normalizedValue
      }

      parseColor(value)
      return value
    }

    const emitActiveValue = (value: string) => {
      if (value !== lastActiveValue.value) {
        lastActiveValue.value = value
        emit('active-change', value)
      }
    }

    const commitValue = (value: string) => {
      if (value !== lastCommittedValue.value) {
        lastCommittedValue.value = value
        emit('update:modelValue', value)
      }
    }

    const tryEmitPreview = (val: string) => {
      const trimmed = normalizeInputValue(val)
      if (isBlankColor(trimmed)) {
        if (props.clearable) {
          isInvalid.value = false
          emitActiveValue('')
        }
        return
      }

      try {
        validateInputValue(trimmed)
        isInvalid.value = false
        emitActiveValue(trimmed)
      } catch {
        isInvalid.value = true
      }
    }

    const tryCommit = (val: string) => {
      const trimmed = normalizeInputValue(val)

      if (isBlankColor(trimmed)) {
        if (!props.clearable) {
          return
        }

        isInvalid.value = false
        emitActiveValue('')
        commitValue('')
        emit('clear')
        return
      }

      try {
        validateInputValue(trimmed)
        isInvalid.value = false
        emitActiveValue(trimmed)
        commitValue(trimmed)
      } catch {
        isInvalid.value = true
      }
    }

    const handleChange = (e: Event) => {
      if (props.disabled || isInputReadOnly()) {
        return
      }

      const val = (e.target as HTMLInputElement).value
      internalValue.value = val
      isInvalid.value = false

      if (debounceTimer) clearTimeout(debounceTimer)

      tryEmitPreview(val)

      debounceTimer = setTimeout(() => {
        if (val !== internalValue.value) return
        tryCommit(val)
      }, 100)
    }

    const handlePaste = (e: ClipboardEvent) => {
      if (props.disabled || isInputReadOnly()) {
        return
      }
      e.preventDefault()
      const text = (e.clipboardData && e.clipboardData.getData('text')) || ''
      const cleaned = text.trim()
      const final = /^[0-9a-fA-F]{3,8}$/.test(cleaned) ? `#${cleaned}` : cleaned

      internalValue.value = final
      tryCommit(final)
    }

    const handleFocus = () => {
      emit('focus')
    }

    const handleBlur = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }

      emit('blur')

      if (props.consumeBlurCommitSuppression?.()) {
        return
      }

      const trimmed = internalValue.value.trim()
      const normalizedValue = normalizeInputValue(trimmed)
      if (normalizedValue !== internalValue.value) {
        internalValue.value = normalizedValue
      }
      if (isBlankColor(normalizedValue)) {
        if (props.clearable) {
          internalValue.value = ''
          tryCommit('')
        } else {
          internalValue.value = lastCommittedValue.value
          isInvalid.value = false
        }
        return
      }

      tryCommit(normalizedValue)
    }

    const handleClear = () => {
      if (props.disabled || props.readOnly) {
        return
      }

      internalValue.value = ''
      isInvalid.value = false
      tryCommit('')
    }

    return () => (
      <div class="vue3-colorful__input-wrapper">
        {props.label && <span class="vue3-colorful__label-text">{props.label}</span>}
        <label class="vue3-colorful__input-label">
          <input
            role="textbox"
            aria-label={props.label || getColorPickerLabel(props.labels, 'colorInput')}
            aria-invalid={isInvalid.value}
            aria-readonly={isInputReadOnly() ? 'true' : undefined}
            class={[
              'vue3-colorful__input',
              isInvalid.value && 'vue3-colorful__input--invalid',
              isInputReadOnly() && 'vue3-colorful__input--readonly',
            ]}
            value={internalValue.value}
            onInput={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            spellcheck={false}
            disabled={props.disabled}
            readonly={isInputReadOnly()}
          />
          {props.clearable && (
            <button
              type="button"
              class="vue3-colorful__clear"
              onClick={handleClear}
              disabled={props.disabled || props.readOnly}
              aria-label={getColorPickerLabel(props.labels, 'clearColor')}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                aria-hidden="true"
              >
                <path d="M4 4l8 8" stroke-linecap="round" />
                <path d="M12 4l-8 8" stroke-linecap="round" />
              </svg>
            </button>
          )}
          <span class="vue3-colorful__error-text" aria-live="polite">
            {isInvalid.value ? getColorPickerLabel(props.labels, 'invalidColorFormat') : ''}
          </span>
        </label>
      </div>
    )
  },
})
