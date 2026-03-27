import {
  AnyColor,
  ColorModel,
  ColorValueType,
  CmykColor,
  HsvaColor,
  HwbColor,
  ObjectColor,
} from '../types'
import {
  cmykToHsva,
  cmykToCmykString,
  cmykStringToCmyk,
  hexToHsva,
  hwbStringToHsva,
  hwbaToHwb,
  hslaStringToHsva,
  hslaToHsl,
  hslaToHsva,
  hsvaStringToHsva,
  hsvaToCmyk,
  hsvaToHex,
  hsvaToHsla,
  hsvaToHwb,
  hsvaToHwbString,
  hsvaToHwbaString,
  hsvaToRgbString,
  hsvaToRgbaString,
  hsvaToHsvString,
  hsvaToHsv,
  hsvaToHsvaString,
  hsvaToHslString,
  hsvaToHslaString,
  hsvaToRgba,
  rgbaToHsva,
  rgbaToRgb,
  rgbaStringToHsva,
  roundHsva,
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

const isRgbColor = (
  color: ObjectColor
): color is { r: number; g: number; b: number; a?: number } => {
  return 'r' in color && 'g' in color && 'b' in color
}

const isHslColor = (
  color: ObjectColor
): color is { h: number; s: number; l: number; a?: number } => {
  return 'h' in color && 's' in color && 'l' in color
}

const isHsvColor = (color: ObjectColor): color is HsvaColor => {
  return 'h' in color && 's' in color && 'v' in color
}

const isHwbColor = (color: ObjectColor): color is HwbColor => {
  return 'h' in color && 'w' in color && 'b' in color
}

const isCmykColor = (color: ObjectColor): color is CmykColor => {
  return 'c' in color && 'm' in color && 'y' in color && 'k' in color
}

export const isObjectColor = (color: AnyColor | null | undefined): color is ObjectColor => {
  return typeof color === 'object' && color !== null
}

export const isBlankColorValue = (color: AnyColor | null | undefined): boolean => {
  if (isObjectColor(color)) {
    return false
  }

  return isBlankColor(color)
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
  hwb: {
    parse: hwbStringToHsva,
    format: (hsva, alpha) => (alpha ? hsvaToHwbaString(hsva) : hsvaToHwbString(hsva)),
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
  if (trimmed.startsWith('hwb(')) return hwbStringToHsva(trimmed)
  if (trimmed.startsWith('cmyk(')) return cmykToHsva(cmykStringToCmyk(trimmed))

  throw new Error(`Unsupported color format: ${color}`)
}

export const parseColorValue = (color: AnyColor): HsvaColor => {
  if (isObjectColor(color)) {
    if (isRgbColor(color)) {
      return rgbaToHsva({
        r: color.r,
        g: color.g,
        b: color.b,
        a: 'a' in color && typeof color.a === 'number' ? color.a : 1,
      })
    }

    if (isHslColor(color)) {
      return hslaToHsva({
        h: color.h,
        s: color.s,
        l: color.l,
        a: 'a' in color && typeof color.a === 'number' ? color.a : 1,
      })
    }

    if (isHsvColor(color)) {
      return roundHsva({
        h: color.h,
        s: color.s,
        v: color.v,
        a: 'a' in color && typeof color.a === 'number' ? color.a : 1,
      })
    }

    if (isHwbColor(color)) {
      return hwbStringToHsva(
        `hwb(${color.h} ${color.w}% ${color.b}%${'a' in color && typeof color.a === 'number' ? ` / ${color.a}` : ''})`
      )
    }

    if (isCmykColor(color)) {
      return cmykToHsva(color)
    }

    throw new Error('Unsupported object color format')
  }

  return parseColor(color)
}

/**
 * Format HSVA to string based on color model
 */
export const formatColor = (hsva: HsvaColor, model: ColorModel, showAlpha: boolean): string => {
  return Converters[model].format(hsva, showAlpha)
}

export const formatColorValue = (
  hsva: HsvaColor,
  model: ColorModel,
  showAlpha: boolean,
  valueType: ColorValueType
): AnyColor => {
  if (valueType === 'string') {
    return formatColor(hsva, model, showAlpha)
  }

  if (model === 'rgb') {
    const rgba = hsvaToRgba(hsva)
    return showAlpha ? rgba : rgbaToRgb(rgba)
  }

  if (model === 'hsl') {
    const hsla = hsvaToHsla(hsva)
    return showAlpha ? hsla : hslaToHsl(hsla)
  }

  if (model === 'hsv' || model === 'hex') {
    const roundedHsva = roundHsva(hsva)
    return showAlpha || model === 'hex' ? roundedHsva : hsvaToHsv(roundedHsva)
  }

  if (model === 'hwb') {
    const hwb = hsvaToHwb(hsva)
    return showAlpha ? hwb : hwbaToHwb(hwb)
  }

  if (model === 'cmyk') {
    return hsvaToCmyk(hsva)
  }

  return formatColor(hsva, model, showAlpha)
}

export const getColorDisplayValue = (color: AnyColor): string => {
  if (isBlankColorValue(color)) {
    return ''
  }

  return formatColor(parseColorValue(color), 'hex', false)
}

const areHsvaColorsEqual = (left: HsvaColor, right: HsvaColor): boolean => {
  const normalizedLeft = roundHsva(left)
  const normalizedRight = roundHsva(right)

  return (
    normalizedLeft.h === normalizedRight.h &&
    normalizedLeft.s === normalizedRight.s &&
    normalizedLeft.v === normalizedRight.v &&
    normalizedLeft.a === normalizedRight.a
  )
}

export const isEqualColorValue = (left: AnyColor, right: AnyColor): boolean => {
  if (isBlankColorValue(left) && isBlankColorValue(right)) {
    return true
  }

  if (isBlankColorValue(left) || isBlankColorValue(right)) {
    return false
  }

  if (typeof left === 'string' && typeof right === 'string') {
    try {
      return areHsvaColorsEqual(parseColorValue(left), parseColorValue(right))
    } catch {
      return normalizeColorString(left) === normalizeColorString(right)
    }
  }

  if (
    (typeof left === 'string' || isObjectColor(left)) &&
    (typeof right === 'string' || isObjectColor(right))
  ) {
    try {
      return areHsvaColorsEqual(parseColorValue(left), parseColorValue(right))
    } catch {
      return false
    }
  }

  return false
}

export const normalizeColorForComparison = (color: string): string => {
  if (isBlankColor(color)) {
    return ''
  }

  return formatColor(parseColor(color), 'hex', false)
}
