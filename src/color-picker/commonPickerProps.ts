import { PropType } from 'vue'
import { AnyColor, ColorPickerLabels, ColorValueType, PresetCollectionItem } from '../types'

export const commonPickerProps = {
  modelValue: {
    type: [String, Object] as PropType<AnyColor>,
    default: '',
  },
  showAlpha: {
    type: Boolean,
    default: false,
  },
  showEyedropper: {
    type: Boolean,
    default: false,
  },
  presets: {
    type: Array as PropType<PresetCollectionItem[]>,
    default: () => [],
  },
  showRecent: {
    type: Boolean,
    default: false,
  },
  maxRecentColors: {
    type: Number,
    default: 8,
  },
  dark: {
    type: Boolean,
    default: false,
  },
  showInput: {
    type: Boolean,
    default: false,
  },
  colorLabel: {
    type: String,
    default: '',
  },
  labels: {
    type: Object as PropType<Partial<ColorPickerLabels>>,
    default: () => ({}),
  },
  vertical: {
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
  editable: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  valueType: {
    type: String as PropType<ColorValueType>,
    default: 'string',
  },
}
