import { defineComponent, ref, watch } from 'vue'

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

    watch(
      () => props.modelValue,
      (newVal) => {
        internalValue.value = newVal
      }
    )

    const handleChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      emit('update:modelValue', val)
    }

    return () => (
      <div class="vue3-colorful__input-wrapper">
        {props.label && <span class="vue3-colorful__input-label">{props.label}</span>}
        <input
          class="vue3-colorful__input"
          value={internalValue.value}
          onInput={handleChange}
          spellcheck={false}
        />
      </div>
    )
  },
})
