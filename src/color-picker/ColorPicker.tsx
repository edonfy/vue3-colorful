import { defineComponent, toRef, PropType } from 'vue'
import { ColorModel } from '@/types'
import { useColorState } from '@/composables/useColorState'
import BasePicker from './BasePicker'
import { commonPickerProps } from './PickerFactory'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    ...commonPickerProps,
    colorModel: {
      type: String as PropType<ColorModel>,
      default: 'hex',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const { hsva, outputValue, handleSaturation, handleSelect } = useColorState({
      modelValue: toRef(props, 'modelValue'),
      colorModel: toRef(props, 'colorModel'),
      showAlpha: toRef(props, 'showAlpha'),
      emit,
    })

    return () => (
      <BasePicker
        hsva={hsva.value}
        showAlpha={props.showAlpha}
        showEyedropper={props.showEyedropper}
        presets={props.presets}
        activeColor={outputValue.value}
        dark={props.dark}
        showInput={props.showInput}
        colorLabel={props.colorLabel}
        vertical={props.vertical}
        onHueChange={(h) => (hsva.value.h = h)}
        onAlphaChange={(a) => (hsva.value.a = a)}
        onSaturationChange={handleSaturation}
        onColorSelect={handleSelect}
        v-slots={slots}
      />
    )
  },
})
