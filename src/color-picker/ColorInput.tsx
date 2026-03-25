import { defineComponent, ref, watch, onUnmounted } from 'vue'
import { parseColor } from '@/utils/converter'

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
    let lastEmittedValue = props.modelValue
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    watch(
      () => props.modelValue,
      (newVal) => {
        // Only update internal if it's different from the already formatted/parsed value
        // to avoid jumping cursors or overwriting active input
        if (newVal !== internalValue.value) {
          internalValue.value = newVal
          isInvalid.value = false
        }
      }
    )

    onUnmounted(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
    })

    const handleChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      internalValue.value = val
      isInvalid.value = false

      if (debounceTimer) clearTimeout(debounceTimer)

      debounceTimer = setTimeout(() => {
        const trimmed = val.trim()
        if (!trimmed) return

        // Verify that the value hasn't changed since the timer started
        if (val !== internalValue.value) return

        try {
          parseColor(trimmed)
          isInvalid.value = false
          if (trimmed !== lastEmittedValue) {
            lastEmittedValue = trimmed
            emit('update:modelValue', trimmed)
          }
        } catch {
          isInvalid.value = true
        }
      }, 100)
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData?.getData('text') || ''
      const cleaned = text.trim()

      // If it looks like a hex without #, add it
      const final = /^[0-9a-fA-F]{3,8}$/.test(cleaned) ? `#${cleaned}` : cleaned

      internalValue.value = final
      try {
        parseColor(final)
        isInvalid.value = false
        if (final !== lastEmittedValue) {
          lastEmittedValue = final
          emit('update:modelValue', final)
        }
      } catch {
        isInvalid.value = true
      }
    }

    const handleBlur = () => {
      const trimmed = internalValue.value.trim()
      if (trimmed !== internalValue.value) {
        internalValue.value = trimmed
        if (!isInvalid.value) {
          emit('update:modelValue', trimmed)
        }
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
