import { defineComponent, ref, watch, computed } from 'vue'
import BasePicker from './BasePicker'
import { HsvaColor } from '@/types'
import { parseColor, formatColor } from '@/utils/converter'

export default defineComponent({
  name: 'CmykColorPicker',

  props: {
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
      type: Array as () => string[],
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 1 })
    let isInternalUpdate = false

    const outputValue = computed(() => formatColor(hsva.value, 'cmyk', props.showAlpha))

    watch(outputValue, (newValue) => {
      isInternalUpdate = true
      emit('update:modelValue', newValue)
    })

    watch(
      () => props.modelValue,
      (newValue) => {
        if (isInternalUpdate) {
          isInternalUpdate = false
          return
        }
        if (newValue) {
          hsva.value = parseColor(newValue)
        }
      },
      { immediate: true }
    )

    const handleSaturation = ({ s, v }: { s: number; v: number }) => {
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
        onHueChange={(h) => (hsva.value.h = h)}
        onAlphaChange={(a) => (hsva.value.a = a)}
        onSaturationChange={handleSaturation}
        onColorSelect={handleSelect}
      />
    )
  },
})
