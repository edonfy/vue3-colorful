import { defineComponent, ref, watch } from 'vue'
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

    watch(
      () => props.modelValue,
      (newVal) => {
        internalValue.value = newVal
        isInvalid.value = false
      }
    )

    const handleChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      internalValue.value = val

      const trimmed = val.trim()
      try {
        if (trimmed) {
          parseColor(trimmed)
          isInvalid.value = false
          emit('update:modelValue', trimmed)
        } else {
          isInvalid.value = false
        }
      } catch {
        isInvalid.value = true
      }
    }

    const handleBlur = () => {
      if (!isInvalid.value && internalValue.value) {
        internalValue.value = internalValue.value.trim()
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
            class={['vue3-colorful__input', isInvalid.value && 'vue3-colorful__input--invalid']}
            value={internalValue.value}
            onInput={handleChange}
            onBlur={handleBlur}
            spellcheck={false}
          />
        </label>
      </div>
    )
  },
})
