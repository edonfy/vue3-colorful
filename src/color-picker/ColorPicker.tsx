import { defineComponent, ref, watch, computed, PropType } from 'vue'
import { HsvaColor, ColorModel } from '@/types'
import { parseColor, formatColor } from '@/utils/converter'
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
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 1 })
    let isInternalUpdate = false

    // Computed output value
    const outputValue = computed(() => formatColor(hsva.value, props.colorModel, props.showAlpha))

    // Watch for internal changes and emit
    watch(
      outputValue,
      (newValue) => {
        isInternalUpdate = true
        emit('update:modelValue', newValue)
      },
      {
        immediate: true,
      }
    )

    // Watch for external modelValue changes
    watch(
      () => props.modelValue,
      (newValue) => {
        if (isInternalUpdate) {
          isInternalUpdate = false
          return
        }

        if (newValue) {
          try {
            hsva.value = parseColor(newValue)
          } catch {
            console.warn(`[vue3-colorful] Invalid color value: ${newValue}`)
          }
        }
      },
      {
        immediate: true,
      }
    )

    const saturationChange = ({ s, v }: { s: number; v: number }) => {
      hsva.value.s = s
      hsva.value.v = v
    }

    const handleSelect = (color: string) => {
      try {
        hsva.value = parseColor(color)
      } catch {
        console.warn(`[vue3-colorful] Invalid selection color: ${color}`)
      }
    }

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
        onSaturationChange={saturationChange}
        onColorSelect={handleSelect}
        v-slots={slots}
      />
    )
  },
})
