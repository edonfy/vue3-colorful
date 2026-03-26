import { defineComponent } from 'vue'
import ColorInput from './ColorInput'

export default defineComponent({
  name: 'PickerInputSection',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
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

  emits: ['colorSelect', 'colorActiveChange', 'clear'],

  setup(props, { emit }) {
    return () => (
      <ColorInput
        modelValue={props.modelValue}
        label={props.label}
        disabled={props.disabled}
        readOnly={props.readOnly}
        editable={props.editable}
        clearable={props.clearable}
        onActive-change={(value: string) => emit('colorActiveChange', value)}
        onUpdate:modelValue={(value: string) => emit('colorSelect', value)}
        onClear={() => emit('clear')}
      />
    )
  },
})
