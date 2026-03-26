import { defineComponent, PropType } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import Eyedropper from './Eyedropper'
import { HsvaColor } from '../types'

export default defineComponent({
  name: 'PickerBody',

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
  },

  emits: [
    'hueChange',
    'hueChangeComplete',
    'alphaChange',
    'alphaChangeComplete',
    'saturationChange',
    'saturationChangeComplete',
    'colorSelect',
  ],

  setup(props, { emit, slots }) {
    return () => (
      <div class={['vue3-colorful__body', { 'vue3-colorful__body--vertical': props.vertical }]}>
        <Saturation
          hsva={props.hsva}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onChange={(value: { s: number; v: number }) => emit('saturationChange', value)}
          onChangeComplete={() => emit('saturationChangeComplete')}
          v-slots={{
            pointer: slots['saturation-pointer'],
            track: slots['saturation-track'],
          }}
        />
        <Hue
          hue={props.hsva.h}
          vertical={props.vertical}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onChange={(value: number) => emit('hueChange', value)}
          onChangeComplete={() => emit('hueChangeComplete')}
          v-slots={{
            pointer: slots['hue-pointer'],
            track: slots['hue-track'],
          }}
        />
        {props.showAlpha && (
          <Alpha
            hsva={props.hsva}
            vertical={props.vertical}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={(value: number) => emit('alphaChange', value)}
            onChangeComplete={() => emit('alphaChangeComplete')}
            v-slots={{
              pointer: slots['alpha-pointer'],
              track: slots['alpha-track'],
            }}
          />
        )}
        {props.showEyedropper && (
          <Eyedropper
            disabled={props.disabled}
            readOnly={props.readOnly}
            onSelect={(color) => emit('colorSelect', color)}
          />
        )}
      </div>
    )
  },
})
