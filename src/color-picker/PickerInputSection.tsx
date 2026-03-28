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
    consumeBlurCommitSuppression: {
      type: Function as PropType<() => boolean>,
      default: undefined,
    },
  },

  emits: ['colorSelect', 'colorActiveChange', 'clear', 'focus', 'blur'],

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
        consumeBlurCommitSuppression={props.consumeBlurCommitSuppression}
        onActive-change={(value: string) => emit('colorActiveChange', value)}
        onUpdate:modelValue={(value: string) => emit('colorSelect', value)}
        onClear={() => emit('clear')}
        onFocus={() => emit('focus')}
        onBlur={() => emit('blur')}
      />
    )
  },
})
