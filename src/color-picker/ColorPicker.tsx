import { defineComponent, ref, watch, computed } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import { HsvaColor, ColorModel } from '@/types'
import {
  hsvaToHex,
  hsvaToRgbString,
  hsvaToRgbaString,
  hsvaToHsvString,
  hsvaToHsvaString,
  hsvaToHslString,
  hsvaToHslaString,
  hexToHsva,
  rgbaStringToHsva,
  hslaStringToHsva,
  hsvaStringToHsva,
  hsvaToCmyk,
  cmykToCmykString,
  cmykStringToCmyk,
  cmykToHsva,
} from '@/utils/convert'

/**
 * Parse a color string to HSVA
 */
const parseColor = (color: string): HsvaColor => {
  if (!color) return { h: 0, s: 100, v: 100, a: 1 }

  const trimmed = color.trim()

  try {
    if (trimmed.startsWith('#')) {
      return hexToHsva(trimmed)
    } else if (trimmed.startsWith('rgb')) {
      return rgbaStringToHsva(trimmed)
    } else if (trimmed.startsWith('hsl')) {
      return hslaStringToHsva(trimmed)
    } else if (trimmed.startsWith('hsv')) {
      return hsvaStringToHsva(trimmed)
    } else if (trimmed.startsWith('cmyk')) {
      const cmyk = cmykStringToCmyk(trimmed)
      return cmykToHsva(cmyk)
    } else {
      // Try to parse as hex without #
      if (/^[0-9a-fA-F]{3,8}$/.test(trimmed)) {
        return hexToHsva('#' + trimmed)
      }
    }
  } catch (error) {
    console.warn(`Failed to parse color: ${color}`, error)
  }

  return { h: 0, s: 100, v: 100, a: 1 }
}

/**
 * Convert HSVA to output string based on color model
 */
const hsvaToOutput = (hsva: HsvaColor, colorModel: ColorModel, showAlpha: boolean): string => {
  switch (colorModel) {
    case 'rgb':
      return showAlpha ? hsvaToRgbaString(hsva) : hsvaToRgbString(hsva)
    case 'hsv':
      return showAlpha ? hsvaToHsvaString(hsva) : hsvaToHsvString(hsva)
    case 'hsl':
      return showAlpha ? hsvaToHslaString(hsva) : hsvaToHslString(hsva)
    case 'cmyk':
      return cmykToCmykString(hsvaToCmyk(hsva))
    default: // 'hex'
      return hsvaToHex(hsva)
  }
}

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
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 1 })
    let isInternalUpdate = false

    // Computed output value
    const outputValue = computed(() => hsvaToOutput(hsva.value, props.colorModel, props.showAlpha))

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

    return () => {
      return (
        <div class={'vue3-colorful'}>
          <Saturation hsva={hsva.value} onChange={saturationChange}></Saturation>
          <Hue hue={hsva.value.h} onChange={hueChange}></Hue>
          {props.showAlpha && <Alpha hsva={hsva.value} onChange={alphaChange}></Alpha>}
        </div>
      )
    }
  },
})
