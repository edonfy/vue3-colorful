import { defineComponent, ref, toRef, PropType } from 'vue'
import BasePicker from './BasePicker'
import { ColorModel } from '../types'
import { useColorState } from '../composables/useColorState'

export const commonPickerProps = {
  modelValue: {
    type: String,
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
    type: Array as PropType<string[]>,
    default: () => [],
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
}

export const createPicker = (name: string, model: ColorModel) => {
  return defineComponent({
    name,
    props: commonPickerProps,
    emits: ['update:modelValue'],
    setup(props, { emit, slots }) {
      const { hsva, outputValue, handleSaturation, handleSelect } = useColorState({
        modelValue: toRef(props, 'modelValue'),
        colorModel: ref(model),
        showAlpha: toRef(props, 'showAlpha'),
        emit,
      })

      return () => (
        <BasePicker
          hsva={hsva.value}
          showAlpha={props.showAlpha}
          showEyedropper={props.showEyedropper}
          presets={props.presets}
          dark={props.dark}
          showInput={props.showInput}
          colorLabel={props.colorLabel}
          vertical={props.vertical}
          activeColor={outputValue.value}
          onHueChange={(h) => (hsva.value.h = h)}
          onAlphaChange={(a) => (hsva.value.a = a)}
          onSaturationChange={handleSaturation}
          onColorSelect={handleSelect}
          v-slots={slots}
        />
      )
    },
  })
}
