import { defineComponent, PropType } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import Eyedropper from './Eyedropper'
import Presets from './Presets'
import ColorInput from './ColorInput'
import { HsvaColor } from '@/types'

export default defineComponent({
  name: 'BasePicker',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
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
      type: Array as () => string[],
      default: () => [],
    },
    activeColor: {
      type: String, // String representation for the active preset highlight
      default: '',
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
    vertical: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['hueChange', 'alphaChange', 'saturationChange', 'colorSelect'],

  setup(props, { emit }) {
    return () => (
      <div
        class={[
          'vue3-colorful',
          {
            'vue3-colorful--dark': props.dark,
          },
        ]}
      >
        <div class={['vue3-colorful__body', { 'vue3-colorful__body--horizontal': props.vertical }]}>
          <Saturation
            hsva={props.hsva}
            onChange={(val) => emit('saturationChange', val)}
          ></Saturation>
          <Hue
            hue={props.hsva.h}
            vertical={props.vertical}
            onChange={(val) => emit('hueChange', val)}
          />
          {props.showAlpha && (
            <Alpha
              hsva={props.hsva}
              vertical={props.vertical}
              onChange={(val) => emit('alphaChange', val)}
            />
          )}
          {props.showEyedropper && (
            <Eyedropper onSelect={(color) => emit('colorSelect', color)}></Eyedropper>
          )}
        </div>
        {props.showInput && (
          <ColorInput
            modelValue={props.activeColor}
            label={props.colorLabel}
            onUpdate:modelValue={(val) => emit('colorSelect', val)}
          />
        )}
        {props.presets.length > 0 && (
          <Presets
            presets={props.presets}
            activeColor={props.activeColor}
            onSelect={(color) => emit('colorSelect', color)}
          ></Presets>
        )}
      </div>
    )
  },
})
