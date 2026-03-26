import { HsvaColor, ColorModel } from '../types'
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

export const DEFAULT_HSVA: Readonly<HsvaColor> = Object.freeze({
  h: 0,
  s: 100,
  v: 100,
  a: 1,
})

export const createDefaultHsva = (): HsvaColor => ({
  ...DEFAULT_HSVA,
})

export const normalizeColorString = (color: string): string => color.trim().toLowerCase()

export const isBlankColor = (color: string | null | undefined): boolean => {
  return color === undefined || color === null || normalizeColorString(color) === ''
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
    // CMYK has no standard alpha extension (no cmyka() CSS function), so showAlpha is ignored
    parse: (str) => cmykToHsva(cmykStringToCmyk(str)),
    format: (hsva) => cmykToCmykString(hsvaToCmyk(hsva)),
  },
}

/**
 * Detect color format and parse to HSVA
 */
export const parseColor = (color: string): HsvaColor => {
  if (isBlankColor(color)) {
    return createDefaultHsva()
  }

  const trimmed = normalizeColorString(color)

  if (trimmed.startsWith('#') || /^[0-9a-fA-F]{3,8}$/.test(trimmed))
    return hexToHsva(trimmed.startsWith('#') ? trimmed : '#' + trimmed)
  if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) return rgbaStringToHsva(trimmed)
  if (trimmed.startsWith('hsl(') || trimmed.startsWith('hsla(')) return hslaStringToHsva(trimmed)
  if (trimmed.startsWith('hsv(') || trimmed.startsWith('hsva(')) return hsvaStringToHsva(trimmed)
  if (trimmed.startsWith('cmyk(')) return cmykToHsva(cmykStringToCmyk(trimmed))

  throw new Error(`Unsupported color format: ${color}`)
}

/**
 * Format HSVA to string based on color model
 */
export const formatColor = (hsva: HsvaColor, model: ColorModel, showAlpha: boolean): string => {
  return Converters[model].format(hsva, showAlpha)
}

export const normalizeColorForComparison = (color: string): string => {
  if (isBlankColor(color)) {
    return ''
  }

  return formatColor(parseColor(color), 'hex', false)
}
