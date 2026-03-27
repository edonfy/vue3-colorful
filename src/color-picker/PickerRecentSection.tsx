import { defineComponent, PropType } from 'vue'
import Presets from './Presets'

export default defineComponent({
  name: 'PickerRecentSection',

  props: {
    showRecent: {
      type: Boolean,
      default: false,
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
      if (!props.showRecent || props.recentColors.length === 0) {
        return null
      }

      return (
        <Presets
          presets={props.recentColors}
          activeColor={props.activeColor}
          disabled={props.disabled}
          readOnly={props.readOnly}
          sectionClass="vue3-colorful__recent"
          sectionLabel="Recent colors"
          onSelect={(color) => emit('colorSelect', color)}
        />
      )
    }
  },
})
