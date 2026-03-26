import { defineComponent, toRef, PropType, computed, ref } from 'vue'
import { ColorModel } from '../types'
import { useColorState } from '../composables/useColorState'
import BasePicker from './BasePicker'
import { commonPickerProps } from './commonPickerProps'
import { isBlankColor, normalizeColorForComparison } from '../utils/converter'

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
    const recentColors = ref<string[]>([])
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

    const addRecentColor = (color: string) => {
      if (!props.showRecent || isBlankColor(color)) {
        return
      }

      const normalizedColor = normalizeColorForComparison(color)
      recentColors.value = [
        color,
        ...recentColors.value.filter(
          (recentColor) => normalizeColorForComparison(recentColor) !== normalizedColor
        ),
      ].slice(0, props.maxRecentColors)
    }

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
        recentColors={recentColors.value}
        copyFormats={props.copyFormats}
        showContrast={props.showContrast}
        onHueChange={(h) => {
          if (isLocked.value) return
          handleHueChange(h)
        }}
        onHueChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
          addRecentColor(displayValue.value)
        }}
        onAlphaChange={(a) => {
          if (isLocked.value) return
          handleAlphaChange(a)
        }}
        onAlphaChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
          addRecentColor(displayValue.value)
        }}
        onSaturationChange={(value) => {
          if (isLocked.value) return
          handleSaturation(value)
        }}
        onSaturationChangeComplete={() => {
          if (isLocked.value) return
          commitCurrentValue()
          addRecentColor(displayValue.value)
        }}
        onColorActiveChange={(color) => {
          if (isInputLocked.value) return
          handleSelect(color, { commit: false })
        }}
        onColorSelect={(color) => {
          if (isLocked.value) return
          handleSelect(color, { commit: true })
          addRecentColor(displayValue.value)
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
