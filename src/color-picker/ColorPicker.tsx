import { defineComponent, ref, watch, computed } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import { HsvaColor, ColorModel } from '@/types'
import { parseColor, formatColor } from '@/utils/converter'
import Eyedropper from './Eyedropper'
import Presets from './Presets'

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

    const hueChange = (h: number) => {
      hsva.value.h = h
    }

    const alphaChange = (a: number) => {
      hsva.value.a = a
    }

    const saturationChange = ({ s, v }: { s: number; v: number }) => {
      hsva.value.s = s
      hsva.value.v = v
    }

    const handleSelect = (color: string) => {
      hsva.value = parseColor(color)
    }

    return () => {
      return (
        <div class={'vue3-colorful'}>
          <Saturation hsva={hsva.value} onChange={saturationChange}></Saturation>
          <Hue hue={hsva.value.h} onChange={hueChange}></Hue>
          {props.showAlpha && <Alpha hsva={hsva.value} onChange={alphaChange}></Alpha>}
          {props.showEyedropper && <Eyedropper onSelect={handleSelect}></Eyedropper>}
          {props.presets.length > 0 && (
            <Presets
              presets={props.presets}
              activeColor={outputValue.value}
              onSelect={handleSelect}
            ></Presets>
          )}
        </div>
      )
    }
  },
})
