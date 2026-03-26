import { defineComponent, ref, watch, onUnmounted } from 'vue'
import { isBlankColor, parseColor } from '../utils/converter'

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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue)
    const isInvalid = ref(false)
    const lastEmittedValue = ref(props.modelValue)
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    watch(
      () => props.modelValue,
      (newVal) => {
        // If parent updates modelValue (external change), sync internal and lastEmittedValue
        if (newVal !== internalValue.value) {
          internalValue.value = newVal
          isInvalid.value = false
          lastEmittedValue.value = newVal
        }
      }
    )

    onUnmounted(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
    })

    const tryEmit = (val: string) => {
      const trimmed = val.trim()
      if (isBlankColor(trimmed)) return

      try {
        parseColor(trimmed)
        isInvalid.value = false
        if (trimmed !== lastEmittedValue.value) {
          lastEmittedValue.value = trimmed
          emit('update:modelValue', trimmed)
        }
      } catch {
        isInvalid.value = true
      }
    }

    const handleChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      internalValue.value = val
      isInvalid.value = false

      if (debounceTimer) clearTimeout(debounceTimer)

      debounceTimer = setTimeout(() => {
        // If user continued typing and internalValue changed, ignore stale timer
        if (val !== internalValue.value) return
        tryEmit(val)
      }, 100)
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const text = (e.clipboardData && e.clipboardData.getData('text')) || ''
      const cleaned = text.trim()
      const final = /^[0-9a-fA-F]{3,8}$/.test(cleaned) ? `#${cleaned}` : cleaned

      internalValue.value = final
      tryEmit(final)
    }

    const handleBlur = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }

      const trimmed = internalValue.value.trim()
      if (trimmed !== internalValue.value) {
        internalValue.value = trimmed
      }
      if (isBlankColor(trimmed)) {
        internalValue.value = lastEmittedValue.value
        isInvalid.value = false
        return
      }

      try {
        parseColor(trimmed)
        isInvalid.value = false
        if (trimmed !== lastEmittedValue.value) {
          lastEmittedValue.value = trimmed
          emit('update:modelValue', trimmed)
        }
      } catch {
        isInvalid.value = true
      }
    }

    return () => (
      <div class="vue3-colorful__input-wrapper">
        <label class="vue3-colorful__input-label">
          {props.label && <span class="vue3-colorful__label-text">{props.label}</span>}
          <input
            role="textbox"
            aria-label={props.label || 'Color Value'}
            aria-invalid={isInvalid.value}
            aria-describedby={props.label ? `${props.label.toLowerCase()}-error` : 'color-error'}
            class={['vue3-colorful__input', isInvalid.value && 'vue3-colorful__input--invalid']}
            value={internalValue.value}
            onInput={handleChange}
            onBlur={handleBlur}
            onPaste={handlePaste}
            spellcheck={false}
          />
          <span
            id={props.label ? `${props.label.toLowerCase()}-error` : 'color-error'}
            class="vue3-colorful__error-text"
            aria-live="polite"
          >
            {isInvalid.value ? 'Invalid color format' : ''}
          </span>
        </label>
      </div>
    )
  },
})
