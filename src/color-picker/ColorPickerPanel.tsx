import { defineComponent, toRef, PropType, computed } from 'vue'
import { ColorModel } from '../types'
import { useColorState } from '../composables/useColorState'
import BasePicker from './BasePicker'
import { commonPickerProps } from './commonPickerProps'

export default defineComponent({
  name: 'ColorPickerPanel',

  props: {
    ...commonPickerProps,
    colorModel: {
      type: String as PropType<ColorModel>,
      default: 'hex',
    },
  },

  emits: ['update:modelValue', 'active-change'],

  setup(props, { emit, slots }) {
    const {
      hsva,
      displayValue,
      handleHueChange,
      handleAlphaChange,
      handleSaturation,
      handleSelect,
      commitCurrentValue,
      clearColor,
    } = useColorState({
      modelValue: toRef(props, 'modelValue'),
      colorModel: toRef(props, 'colorModel'),
      showAlpha: toRef(props, 'showAlpha'),
      valueType: toRef(props, 'valueType'),
      emit,
    })

    const isLocked = computed(() => props.disabled || props.readOnly)
    const isInputLocked = computed(() => isLocked.value || !props.editable)

    return () => (
      <BasePicker
        hsva={hsva.value}
        showAlpha={props.showAlpha}
        showEyedropper={props.showEyedropper}
        presets={props.presets}
        activeColor={displayValue.value}
        dark={props.dark}
        showInput={props.showInput}
        colorLabel={props.colorLabel}
        vertical={props.vertical}
        disabled={props.disabled}
        readOnly={props.readOnly}
        editable={props.editable}
        clearable={props.clearable}
        onHueChange={(h) => {
          if (isLocked.value) return
          handleHueChange(h)
        }}
        onHueChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
        }}
        onAlphaChange={(a) => {
          if (isLocked.value) return
          handleAlphaChange(a)
        }}
        onAlphaChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
        }}
        onSaturationChange={(value) => {
          if (isLocked.value) return
          handleSaturation(value)
        }}
        onSaturationChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
        }}
        onColorActiveChange={(color) => {
          if (isInputLocked.value) return
          handleSelect(color, { commit: false })
        }}
        onColorSelect={(color) => {
          if (isLocked.value) return
          handleSelect(color, { commit: true })
        }}
        onClear={() => {
          if (isLocked.value) return
          clearColor()
        }}
        v-slots={slots}
      />
    )
  },
})
