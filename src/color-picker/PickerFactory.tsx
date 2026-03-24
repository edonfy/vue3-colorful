import { defineComponent, ref, watch, computed, PropType } from 'vue'
import BasePicker from './BasePicker'
import { HsvaColor, ColorModel } from '../types'
import { parseColor, formatColor } from '../utils/converter'

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
      const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 1 })
      let isInternalUpdate = false

      const outputValue = computed(() => formatColor(hsva.value, model, props.showAlpha))

      watch(
        outputValue,
        (newValue) => {
          isInternalUpdate = true
          emit('update:modelValue', newValue)
        },
        { immediate: true }
      )

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
        { immediate: true }
      )

      const handleSaturation = ({ s, v }: { s: number; v: number }) => {
        hsva.value.s = s
        hsva.value.v = v
      }

      const handleSelect = (color: string) => {
        try {
          hsva.value = parseColor(color)
        } catch {
          console.warn(`[vue3-colorful] Invalid preset color: ${color}`)
        }
      }

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
