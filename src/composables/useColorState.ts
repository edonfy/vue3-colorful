import { ref, watch, computed, Ref, ComputedRef } from 'vue'
import { AnyColor, ColorModel, ColorValueType, HsvaColor } from '../types'
import {
  createDefaultHsva,
  formatColor,
  formatColorValue,
  isBlankColorValue,
  isEqualColorValue,
  parseColorValue,
} from '../utils/converter'

interface UseColorStateOptions {
  modelValue: Ref<AnyColor>
  colorModel: Ref<ColorModel>
  showAlpha: Ref<boolean>
  valueType: Ref<ColorValueType>
  emit: (event: 'update:modelValue' | 'active-change', value: AnyColor) => void
}

interface UseColorStateReturn {
  hsva: Ref<HsvaColor>
  displayValue: ComputedRef<string>
  outputValue: ComputedRef<AnyColor>
  handleHueChange: (value: number) => void
  handleAlphaChange: (value: number) => void
  handleSaturation: (val: { s: number; v: number }) => void
  handleSelect: (color: string, options?: { commit?: boolean }) => AnyColor | null
  clearColor: () => AnyColor
  commitCurrentValue: () => AnyColor | null
}

export function useColorState(options: UseColorStateOptions): UseColorStateReturn {
  const { modelValue, colorModel, showAlpha, valueType, emit } = options
  const hsva = ref<HsvaColor>(createDefaultHsva())
  const isBlank = ref(isBlankColorValue(modelValue.value))
  const formatDisplayValue = (): string =>
    isBlank.value ? '' : formatColor(hsva.value, colorModel.value, showAlpha.value)
  const formatOutputValue = (): AnyColor =>
    isBlank.value
      ? ''
      : formatColorValue(hsva.value, colorModel.value, showAlpha.value, valueType.value)

  if (!isBlank.value) {
    try {
      hsva.value = parseColorValue(modelValue.value)
    } catch {
      console.warn(`[vue3-colorful] Initial color value is invalid: ${modelValue.value}`)
    }
  }
  const lastCommittedValue = ref<AnyColor>(modelValue.value)
  const lastActiveValue = ref<AnyColor>(formatOutputValue())

  const displayValue = computed(() => formatDisplayValue())
  const outputValue = computed(() => formatOutputValue())

  const emitActiveValue = (value: AnyColor) => {
    if (!isEqualColorValue(value, lastActiveValue.value)) {
      lastActiveValue.value = value
      emit('active-change', value)
    }
  }

  const commitValue = (value: AnyColor): boolean => {
    if (!isEqualColorValue(value, lastCommittedValue.value)) {
      lastCommittedValue.value = value
      emit('update:modelValue', value)
      return true
    }

    return false
  }

  watch(modelValue, (newValue) => {
    if (isEqualColorValue(newValue, lastCommittedValue.value)) {
      return
    }

    if (newValue !== undefined && newValue !== null) {
      if (isBlankColorValue(newValue)) {
        hsva.value = createDefaultHsva()
        isBlank.value = true
        lastCommittedValue.value = ''
        lastActiveValue.value = ''
        return
      }

      try {
        hsva.value = parseColorValue(newValue)
        isBlank.value = false
        lastCommittedValue.value = newValue
        lastActiveValue.value = formatOutputValue()
      } catch {
        console.warn(`[vue3-colorful] Invalid color value: ${newValue}`)
        lastCommittedValue.value = newValue
      }
    }
  })

  const updateHsva = (updater: (color: HsvaColor) => void, shouldCommit = false) => {
    isBlank.value = false
    updater(hsva.value)

    const nextValue = formatOutputValue()
    emitActiveValue(nextValue)

    if (shouldCommit) {
      commitValue(nextValue)
    }
  }

  const handleHueChange = (value: number) => {
    updateHsva((color) => {
      color.h = value
    })
  }

  const handleAlphaChange = (value: number) => {
    updateHsva((color) => {
      color.a = value
    })
  }

  const handleSaturation = ({ s, v }: { s: number; v: number }) => {
    updateHsva((color) => {
      color.s = s
      color.v = v
    })
  }

  const handleSelect = (
    color: string,
    selectionOptions: { commit?: boolean } = {}
  ): AnyColor | null => {
    if (isBlankColorValue(color)) {
      isBlank.value = true
      emitActiveValue('')
      if (selectionOptions.commit) {
        commitValue('')
      }
      return ''
    }

    try {
      hsva.value = parseColorValue(color)
      isBlank.value = false
      const nextValue = formatOutputValue()
      emitActiveValue(nextValue)

      if (selectionOptions.commit) {
        return commitValue(nextValue) ? nextValue : null
      }

      return nextValue
    } catch {
      console.warn(`[vue3-colorful] Invalid selection color: ${color.trim()}`)
    }

    return null
  }

  const clearColor = (): AnyColor => {
    isBlank.value = true
    emitActiveValue('')
    commitValue('')
    return ''
  }

  const commitCurrentValue = (): AnyColor | null => {
    const nextValue = formatOutputValue()
    return commitValue(nextValue) ? nextValue : null
  }

  return {
    hsva,
    displayValue,
    outputValue,
    handleHueChange,
    handleAlphaChange,
    handleSaturation,
    handleSelect,
    clearColor,
    commitCurrentValue,
  }
}
