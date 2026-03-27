import { defineComponent, PropType } from 'vue'
import ColorInput from './ColorInput'
import { ColorPickerLabels } from '../types'

export default defineComponent({
  name: 'HexColorInput',
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
  },
  emits: ['update:modelValue', 'active-change', 'clear'],
  setup(props, { emit }) {
    return () => (
      <ColorInput
        {...props}
        format="hex"
        onUpdate:modelValue={(value: string) => emit('update:modelValue', value)}
        onActive-change={(value: string) => emit('active-change', value)}
        onClear={() => emit('clear')}
      />
    )
  },
})
