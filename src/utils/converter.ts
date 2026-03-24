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
} from './convert'

interface Converter {
  parse: (color: string) => HsvaColor
  format: (hsva: HsvaColor, showAlpha: boolean) => string
}

const Converters: Record<ColorModel, Converter> = {
  hex: {
    parse: hexToHsva,
    format: hsvaToHex,
  },
  rgb: {
    parse: rgbaStringToHsva,
    format: (hsva, alpha) => (alpha ? hsvaToRgbaString(hsva) : hsvaToRgbString(hsva)),
  },
  hsl: {
    parse: hslaStringToHsva,
    format: (hsva, alpha) => (alpha ? hsvaToHslaString(hsva) : hsvaToHslString(hsva)),
  },
  hsv: {
    parse: hsvaStringToHsva,
    format: (hsva, alpha) => (alpha ? hsvaToHsvaString(hsva) : hsvaToHsvString(hsva)),
  },
  cmyk: {
    parse: (str) => cmykToHsva(cmykStringToCmyk(str)),
    format: (hsva) => cmykToCmykString(hsvaToCmyk(hsva)),
  },
}

/**
 * Detect color format and parse to HSVA
 */
export const parseColor = (color: string): HsvaColor => {
  if (!color) return { h: 0, s: 100, v: 100, a: 1 }
  const trimmed = color.trim().toLowerCase()

  if (trimmed.startsWith('#')) return hexToHsva(trimmed)
  if (trimmed.startsWith('rgb')) return rgbaStringToHsva(trimmed)
  if (trimmed.startsWith('hsl')) return hslaStringToHsva(trimmed)
  if (trimmed.startsWith('hsv')) return hsvaStringToHsva(trimmed)
  if (trimmed.startsWith('cmyk')) return cmykToHsva(cmykStringToCmyk(trimmed))

  // Fallback for hex without #
  if (/^[0-9a-f]{3,8}$/.test(trimmed)) return hexToHsva('#' + trimmed)

  return { h: 0, s: 100, v: 100, a: 1 }
}

/**
 * Format HSVA to string based on color model
 */
export const formatColor = (hsva: HsvaColor, model: ColorModel, showAlpha: boolean): string => {
  return Converters[model].format(hsva, showAlpha)
}
