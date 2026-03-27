import { defineComponent, PropType } from 'vue'
import ColorInput from './ColorInput'
import { ColorPickerLabels } from '../types'

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

  emits: ['colorSelect', 'colorActiveChange', 'clear'],

  setup(props, { emit }) {
    return () => (
      <ColorInput
        modelValue={props.modelValue}
        label={props.label}
        labels={props.labels}
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
