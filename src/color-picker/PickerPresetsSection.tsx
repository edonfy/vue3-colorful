import { defineComponent, PropType } from 'vue'
import Presets from './Presets'
import { PresetCollectionItem } from '../types'

export default defineComponent({
  name: 'PickerPresetsSection',

  props: {
    presets: {
      type: Array as PropType<PresetCollectionItem[]>,
      default: () => [],
    },
    recentColors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    activeColor: {
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
  },

  emits: ['colorSelect'],

  setup(props, { emit }) {
    return () => {
      if (props.presets.length === 0 && props.recentColors.length === 0) {
        return null
      }

      return (
        <Presets
          presets={props.presets}
          recentColors={props.recentColors}
          activeColor={props.activeColor}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onSelect={(color) => emit('colorSelect', color)}
        />
      )
    }
  },
})
