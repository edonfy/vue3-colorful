import { computed, defineComponent, PropType, ref, toRef, watch } from 'vue'
import { AnyColor, ColorModel } from '../types'
import { useColorState } from '../composables/useColorState'
import BasePicker from './BasePicker'
import { commonPickerProps } from './commonPickerProps'
import { formatColor, isBlankColorValue, parseColorValue } from '../utils/converter'

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
    const recentColors = ref<string[]>([])

    const trimRecentColors = (colors: string[]): string[] => {
      return colors.slice(0, Math.max(0, props.maxRecentColors))
    }

    const rememberRecentColor = (value: AnyColor | null) => {
      if (!props.showRecent || value === null || isBlankColorValue(value)) {
        return
      }

      try {
        const recentColor = formatColor(parseColorValue(value), 'hex', props.showAlpha)
        recentColors.value = trimRecentColors([
          recentColor,
          ...recentColors.value.filter((entry) => entry !== recentColor),
        ])
      } catch {
        console.warn(`[vue3-colorful] Invalid recent color: ${String(value)}`)
      }
    }

    watch(
      () => props.maxRecentColors,
      () => {
        recentColors.value = trimRecentColors(recentColors.value)
      }
    )

    return () => (
      <BasePicker
        hsva={hsva.value}
        showAlpha={props.showAlpha}
        showEyedropper={props.showEyedropper}
        presets={props.presets}
        recentColors={recentColors.value}
        showRecent={props.showRecent}
        activeColor={displayValue.value}
        dark={props.dark}
        showInput={props.showInput}
        colorLabel={props.colorLabel}
        labels={props.labels}
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
          rememberRecentColor(commitCurrentValue())
        }}
        onAlphaChange={(a) => {
          if (isLocked.value) return
          handleAlphaChange(a)
        }}
        onAlphaChangeComplete={() => {
          if (isLocked.value) return
          rememberRecentColor(commitCurrentValue())
        }}
        onSaturationChange={(value) => {
          if (isLocked.value) return
          handleSaturation(value)
        }}
        onSaturationChangeComplete={() => {
          if (isLocked.value) return
          rememberRecentColor(commitCurrentValue())
        }}
        onColorActiveChange={(color) => {
          if (isInputLocked.value) return
          handleSelect(color, { commit: false })
        }}
        onColorSelect={(color) => {
          if (isLocked.value) return
          rememberRecentColor(handleSelect(color, { commit: true }))
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
