import { defineComponent, ref, watch, computed } from 'vue'
import { HsvaColor, ColorModel } from '@/types'
import { parseColor, formatColor } from '@/utils/converter'
import BasePicker from './BasePicker'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    colorModel: {
      type: String as () => ColorModel,
      default: 'hex',
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
      type: Array as () => string[],
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
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
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
          const parsed = parseColor(newValue)
          hsva.value = parsed
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
      hsva.value = parseColor(color)
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
      />
    )
  },
})
