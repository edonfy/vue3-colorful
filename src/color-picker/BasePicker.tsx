import { defineComponent, PropType } from 'vue'
import PickerBody from './PickerBody'
import PickerActions from './PickerActions'
import PickerInputSection from './PickerInputSection'
import PickerPresetsSection from './PickerPresetsSection'
import PickerRecentSection from './PickerRecentSection'
import { ColorPickerLabels, HsvaColor, PresetCollectionItem } from '../types'

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
      type: Array as PropType<PresetCollectionItem[]>,
      default: () => [],
    },
    recentColors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    showRecent: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
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
  },

  emits: [
    'hueChange',
    'hueChangeComplete',
    'alphaChange',
    'alphaChangeComplete',
    'saturationChange',
    'saturationChangeComplete',
    'colorSelect',
    'colorActiveChange',
    'clear',
  ],

  setup(props, { emit, slots }) {
    return () => (
      <div
        class={[
          'vue3-colorful',
          {
            'vue3-colorful--dark': props.dark,
            'vue3-colorful--vertical': props.vertical,
            'vue3-colorful--disabled': props.disabled,
            'vue3-colorful--readonly': props.readOnly,
          },
        ]}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-readonly={props.readOnly ? 'true' : undefined}
      >
        <PickerBody
          hsva={props.hsva}
          showAlpha={props.showAlpha}
          showEyedropper={props.showEyedropper}
          labels={props.labels}
          vertical={props.vertical}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onSaturationChange={(value: { s: number; v: number }) => emit('saturationChange', value)}
          onSaturationChangeComplete={() => emit('saturationChangeComplete')}
          onHueChange={(value: number) => emit('hueChange', value)}
          onHueChangeComplete={() => emit('hueChangeComplete')}
          onAlphaChange={(value: number) => emit('alphaChange', value)}
          onAlphaChangeComplete={() => emit('alphaChangeComplete')}
          onColorSelect={(color: string) => emit('colorSelect', color)}
          v-slots={{
            'saturation-pointer': slots['saturation-pointer'],
            'saturation-track': slots['saturation-track'],
            'hue-pointer': slots['hue-pointer'],
            'hue-track': slots['hue-track'],
            'alpha-pointer': slots['alpha-pointer'],
            'alpha-track': slots['alpha-track'],
          }}
        />
        {props.showInput && (
          <PickerInputSection
            modelValue={props.activeColor}
            label={props.colorLabel}
            labels={props.labels}
            disabled={props.disabled}
            readOnly={props.readOnly}
            editable={props.editable}
            clearable={props.clearable}
            onColorActiveChange={(value: string) => emit('colorActiveChange', value)}
            onColorSelect={(value: string) => emit('colorSelect', value)}
            onClear={() => emit('clear')}
          />
        )}
        {!props.showInput && props.clearable && (
          <PickerActions
            disabled={props.disabled}
            readOnly={props.readOnly}
            labels={props.labels}
            onClear={() => emit('clear')}
          />
        )}
        <PickerPresetsSection
          presets={props.presets}
          activeColor={props.activeColor}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onColorSelect={(color: string) => emit('colorSelect', color)}
        />
        <PickerRecentSection
          showRecent={props.showRecent}
          recentColors={props.recentColors}
          activeColor={props.activeColor}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onColorSelect={(color: string) => emit('colorSelect', color)}
        />
      </div>
    )
  },
})
