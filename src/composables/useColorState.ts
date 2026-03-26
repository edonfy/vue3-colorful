import { ref, watch, computed, Ref, ComputedRef } from 'vue'
import { HsvaColor, ColorModel } from '../types'
import { createDefaultHsva, parseColor, formatColor, isBlankColor } from '../utils/converter'

interface UseColorStateOptions {
  modelValue: Ref<string>
  colorModel: Ref<ColorModel>
  showAlpha: Ref<boolean>
  emit: (event: 'update:modelValue', value: string) => void
}

interface UseColorStateReturn {
  hsva: Ref<HsvaColor>
  outputValue: ComputedRef<string>
  handleSaturation: (val: { s: number; v: number }) => void
  handleSelect: (color: string) => void
}

export function useColorState(options: UseColorStateOptions): UseColorStateReturn {
  const { modelValue, colorModel, showAlpha, emit } = options
  const hsva = ref<HsvaColor>(createDefaultHsva())

  if (!isBlankColor(modelValue.value)) {
    try {
      hsva.value = parseColor(modelValue.value)
    } catch {
      console.warn(`[vue3-colorful] Initial color value is invalid: ${modelValue.value}`)
    }
  }
  const lastEmittedValue = ref<string>(modelValue.value)

  const outputValue = computed(() => formatColor(hsva.value, colorModel.value, showAlpha.value))

  watch(outputValue, (newValue) => {
    if (newValue !== lastEmittedValue.value) {
      lastEmittedValue.value = newValue
      emit('update:modelValue', newValue)
    }
  })

  watch(modelValue, (newValue) => {
    // If the incoming value matches the last value we emitted, it's an echo; skip it.
    if (newValue === lastEmittedValue.value) {
      return
    }

    if (newValue !== undefined && newValue !== null) {
      if (isBlankColor(newValue)) {
        hsva.value = createDefaultHsva()
        lastEmittedValue.value = outputValue.value
        return
      }

      try {
        hsva.value = parseColor(newValue)
      } catch {
        console.warn(`[vue3-colorful] Invalid color value: ${newValue}`)
        // Record the incoming (invalid) value as last seen external value
        // to avoid confusing the echo-detection logic.
        lastEmittedValue.value = newValue
      }
    }
  })

  const handleSaturation = ({ s, v }: { s: number; v: number }) => {
    hsva.value.s = s
    hsva.value.v = v
  }

  const handleSelect = (color: string) => {
    if (isBlankColor(color)) {
      return
    }

    try {
      hsva.value = parseColor(color)
    } catch {
      console.warn(`[vue3-colorful] Invalid selection color: ${color.trim()}`)
    }
  }

  return {
    hsva,
    outputValue,
    handleSaturation,
    handleSelect,
  }
}
