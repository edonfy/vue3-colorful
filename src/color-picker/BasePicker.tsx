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
      type: Array as PropType<string[]>,
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

  setup(props, { emit, slots }) {
    return () => (
      <div
        class={[
          'vue3-colorful',
          {
            'vue3-colorful--dark': props.dark,
            'vue3-colorful--vertical': props.vertical,
          },
        ]}
      >
        <div class={['vue3-colorful__body', { 'vue3-colorful__body--vertical': props.vertical }]}>
          <Saturation
            hsva={props.hsva}
            onChange={(val: { s: number; v: number }) => emit('saturationChange', val)}
            v-slots={{
              pointer: slots['saturation-pointer'],
              track: slots['saturation-track'],
            }}
          ></Saturation>
          <Hue
            hue={props.hsva.h}
            vertical={props.vertical}
            onChange={(val: number) => emit('hueChange', val)}
            v-slots={{
              pointer: slots['hue-pointer'],
              track: slots['hue-track'],
            }}
          />
          {props.showAlpha && (
            <Alpha
              hsva={props.hsva}
              vertical={props.vertical}
              onChange={(val: number) => emit('alphaChange', val)}
              v-slots={{
                pointer: slots['alpha-pointer'],
                track: slots['alpha-track'],
              }}
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
