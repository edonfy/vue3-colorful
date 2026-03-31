import { round } from './round'
import {
  RgbaColor,
  RgbColor,
  HslaColor,
  HslColor,
  HsvaColor,
  HsvColor,
  CmykColor,
  HwbColor,
  HwbaColor,
} from '../types'

/**
 * Valid CSS <angle> units.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
const angleUnits: Record<string, number> = {
  deg: 1,
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2),
}

/**
 * Regular expressions for parsing color strings (Pre-compiled)
 */
const COLOR_PATTERNS = {
  hsl: /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i,
  hsv: /hsva?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i,
  hwb: /hwb\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%[,\s]+(-?\d*\.?\d+)%\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i,
  rgb: /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i,
  cmyk: /cmyk\(\s*(-?\d*\.?\d+)%?\s*,\s*(-?\d*\.?\d+)%?\s*,\s*(-?\d*\.?\d+)%?\s*,\s*(-?\d*\.?\d+)%?\s*\)/i,
}

/**
 * Parse hue value with unit conversion
 */
export const parseHue = (value: string, unit = 'deg'): number => {
  return Number(value) * (angleUnits[unit] || 1)
}

/**
 * Convert hex string to RGBA color object
 */
export const hexToRgba = (hex: string): RgbaColor => {
  if (hex[0] === '#') hex = hex.substring(1)

  if (!/^[0-9a-fA-F]{3,8}$/.test(hex) || [5, 7].includes(hex.length)) {
    throw new Error(`Invalid HEX color: ${hex}`)
  }

  if (hex.length < 6) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? round(parseInt(hex[3] + hex[3], 16) / 255, 2) : 1,
    }
  }

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    a: hex.length === 8 ? round(parseInt(hex.substring(6, 8), 16) / 255, 2) : 1,
  }
}

/**
 * Convert hex string to HSVA color object
 */
export const hexToHsva = (hex: string): HsvaColor => rgbaToHsva(hexToRgba(hex))

/**
 * Convert HSLA string to HSVA color object
 */
export const hslaStringToHsva = (hslString: string): HsvaColor => {
  const match = COLOR_PATTERNS.hsl.exec(hslString)

  if (!match) throw new Error(`Invalid HSL color: ${hslString}`)

  return hslaToHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  })
}

/**
 * Convert HSLA color object to HSVA
 */
export const hslaToHsva = ({ h, s, l, a }: HslaColor): HsvaColor => {
  s *= (l < 50 ? l : 100 - l) / 100

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
    a,
  }
}

/**
 * Convert HSVA color object to hex string
 */
export const hsvaToHex = (hsva: HsvaColor): string => rgbaToHex(hsvaToRgba(hsva))

/**
 * Convert HSVA to HSL string
 */
export const hsvaToHslString = (hsva: HsvaColor): string => {
  const { h, s, l } = hsvaToHsla(hsva)
  return `hsl(${h}, ${s}%, ${l}%)`
}

/**
 * Convert HSVA to HSV string
 */
export const hsvaToHsvString = (hsva: HsvaColor): string => {
  const { h, s, v } = roundHsva(hsva)
  return `hsv(${h}, ${s}%, ${v}%)`
}

/**
 * Convert HSVA to HSVA string
 */
export const hsvaToHsvaString = (hsva: HsvaColor): string => {
  const { h, s, v, a } = roundHsva(hsva)
  return `hsva(${h}, ${s}%, ${v}%, ${a})`
}

export const hsvaToHwb = (hsva: HsvaColor): HwbaColor => {
  const rgba = hsvaToRgba(hsva)
  const maxChannel = Math.max(rgba.r, rgba.g, rgba.b) / 255
  const minChannel = Math.min(rgba.r, rgba.g, rgba.b) / 255

  return {
    h: round(hsva.h),
    w: round(minChannel * 100),
    b: round((1 - maxChannel) * 100),
    a: round(hsva.a, 2),
  }
}

export const hsvaToHwbString = (hsva: HsvaColor): string => {
  const { h, w, b } = hsvaToHwb(hsva)
  return `hwb(${h} ${w}% ${b}%)`
}

export const hsvaToHwbaString = (hsva: HsvaColor): string => {
  const { h, w, b, a } = hsvaToHwb(hsva)
  return `hwb(${h} ${w}% ${b}% / ${a})`
}

/**
 * Convert HSVA to HSLA string
 */
export const hsvaToHslaString = (hsva: HsvaColor): string => {
  const { h, s, l, a } = hsvaToHsla(hsva)
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

/**
 * Memoization cache with LRU strategy
 */
const cache = new Map<string, RgbaColor | HslaColor>()
const MAX_CACHE_SIZE = 100

const memoize = <T extends RgbaColor | HslaColor>(
  keyPrefix: string,
  hsva: HsvaColor,
  fn: (hsva: HsvaColor) => T
): T => {
  const key = `${keyPrefix}_${round(hsva.h, 4)}_${round(hsva.s, 4)}_${round(hsva.v, 4)}_${round(hsva.a, 4)}`
  if (cache.has(key)) {
    const cached = cache.get(key) as T
    cache.delete(key)
    cache.set(key, cached)
    return cached
  }

  const result = fn(hsva)

  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value
    if (firstKey !== undefined) cache.delete(firstKey)
  }

  cache.set(key, result)
  return result
}

/**
 * Convert HSVA color object to HSLA (Memoized)
 */
export const hsvaToHsla = (hsva: HsvaColor): HslaColor => {
  return memoize('hsla', hsva, ({ h, s, v, a }) => {
    const hh = ((200 - s) * v) / 100

    return {
      h: round(h),
      s: round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
      l: round(hh / 2),
      a: round(a, 2),
    }
  })
}

/**
 * Convert HSVA color object to RGBA (Memoized)
 */
export const hsvaToRgba = (hsva: HsvaColor): RgbaColor => {
  return memoize('rgba', hsva, ({ h, s, v, a }) => {
    const normalizedH = ((h % 360) + 360) % 360
    const hn = (normalizedH / 360) * 6
    const sn = s / 100
    const vn = v / 100

    const hh = Math.floor(hn),
      b = vn * (1 - sn),
      c = vn * (1 - (hn - hh) * sn),
      d = vn * (1 - (1 - hn + hh) * sn),
      module = hh % 6

    return {
      r: round([vn, c, b, b, d, vn][module] * 255),
      g: round([d, vn, vn, c, b, b][module] * 255),
      b: round([b, b, d, vn, vn, c][module] * 255),
      a: round(a, 2),
    }
  })
}

/**
 * Convert HSVA to RGB string
 */
export const hsvaToRgbString = (hsva: HsvaColor): string => {
  const { r, g, b } = hsvaToRgba(hsva)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Convert HSVA to RGBA string
 */
export const hsvaToRgbaString = (hsva: HsvaColor): string => {
  const { r, g, b, a } = hsvaToRgba(hsva)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/**
 * Convert HSVA string to HSVA color object
 */
export const hsvaStringToHsva = (hsvString: string): HsvaColor => {
  const match = COLOR_PATTERNS.hsv.exec(hsvString)

  if (!match) throw new Error(`Invalid HSV color: ${hsvString}`)

  return roundHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    v: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  })
}

export const hwbStringToHsva = (hwbString: string): HsvaColor => {
  const match = COLOR_PATTERNS.hwb.exec(hwbString)

  if (!match) throw new Error(`Invalid HWB color: ${hwbString}`)

  return hwbaToHsva({
    h: parseHue(match[1], match[2]),
    w: Number(match[3]),
    b: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  })
}

/**
 * Convert RGBA string to HSVA color object
 */
export const rgbaStringToHsva = (rgbaString: string): HsvaColor => {
  const match = COLOR_PATTERNS.rgb.exec(rgbaString)

  if (!match) throw new Error(`Invalid RGB color: ${rgbaString}`)

  return rgbaToHsva({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
  })
}

/**
 * Format number to hex string
 */
const format = (number: number) => {
  const clamped = Math.min(255, Math.max(0, Math.round(number)))
  const hex = clamped.toString(16)
  return hex.length < 2 ? '0' + hex : hex
}

/**
 * Convert RGBA color object to hex string
 */
export const rgbaToHex = ({ r, g, b, a }: RgbaColor): string => {
  const alphaHex = a < 1 ? format(round(a * 255)) : ''
  return '#' + format(r) + format(g) + format(b) + alphaHex
}

/**
 * Convert RGBA color object to HSVA
 */
export const rgbaToHsva = ({ r, g, b, a }: RgbaColor): HsvaColor => {
  const max = Math.max(r, g, b)
  const delta = max - Math.min(r, g, b)

  // prettier-ignore
  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0

  return {
    h: 60 * (hh < 0 ? hh + 6 : hh),
    s: max ? (delta / max) * 100 : 0,
    v: (max / 255) * 100,
    a,
  }
}

export const hwbaToHsva = ({ h, w, b, a }: HwbaColor): HsvaColor => {
  const whiteRatio = Math.max(0, Math.min(100, w)) / 100
  const blackRatio = Math.max(0, Math.min(100, b)) / 100

  if (whiteRatio + blackRatio >= 1) {
    const grayscaleChannel = round((whiteRatio / (whiteRatio + blackRatio || 1)) * 255)
    return rgbaToHsva({ r: grayscaleChannel, g: grayscaleChannel, b: grayscaleChannel, a })
  }

  const pureHue = hsvaToRgba({ h, s: 100, v: 100, a })
  const factor = 1 - whiteRatio - blackRatio

  return rgbaToHsva({
    r: round((pureHue.r / 255) * factor * 255 + whiteRatio * 255),
    g: round((pureHue.g / 255) * factor * 255 + whiteRatio * 255),
    b: round((pureHue.b / 255) * factor * 255 + whiteRatio * 255),
    a,
  })
}

/**
 * Round HSVA values
 */
export const roundHsva = (hsva: HsvaColor): HsvaColor => ({
  h: round(hsva.h),
  s: round(hsva.s),
  v: round(hsva.v),
  a: round(hsva.a, 2),
})

/**
 * Convert RGBA to RGB (without alpha)
 */
export const rgbaToRgb = ({ r, g, b }: RgbaColor): RgbColor => ({ r, g, b })

/**
 * Convert HSLA to HSL (without alpha)
 */
export const hslaToHsl = ({ h, s, l }: HslaColor): HslColor => ({ h, s, l })

/**
 * Convert HSVA to HSV (without alpha)
 */
export const hsvaToHsv = (hsva: HsvaColor): HsvColor => {
  const { h, s, v } = roundHsva(hsva)
  return { h, s, v }
}

export const hwbaToHwb = ({ h, w, b }: HwbaColor): HwbColor => ({
  h: round(h),
  w: round(w),
  b: round(b),
})

/**
 * Convert RGBA color object to CMYK
 */
export const rgbaToCmyk = ({ r, g, b }: RgbaColor): CmykColor => {
  const rNormalized = r / 255
  const gNormalized = g / 255
  const bNormalized = b / 255

  const k = 1 - Math.max(rNormalized, gNormalized, bNormalized)

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  const c = (1 - rNormalized - k) / (1 - k)
  const m = (1 - gNormalized - k) / (1 - k)
  const y = (1 - bNormalized - k) / (1 - k)

  return {
    c: round(c * 100),
    m: round(m * 100),
    y: round(y * 100),
    k: round(k * 100),
  }
}

/**
 * Convert CMYK color object to RGBA
 */
export const cmykToRgba = ({ c, m, y, k }: CmykColor): RgbaColor => {
  const cNormalized = c / 100
  const mNormalized = m / 100
  const yNormalized = y / 100
  const kNormalized = k / 100

  const r = 255 * (1 - cNormalized) * (1 - kNormalized)
  const g = 255 * (1 - mNormalized) * (1 - kNormalized)
  const b = 255 * (1 - yNormalized) * (1 - kNormalized)

  return {
    r: round(r),
    g: round(g),
    b: round(b),
    a: 1,
  }
}

/**
 * Convert HSVA color object to CMYK
 */
export const hsvaToCmyk = (hsva: HsvaColor): CmykColor => {
  const rgba = hsvaToRgba(hsva)
  return rgbaToCmyk(rgba)
}

/**
 * Convert CMYK color object to HSVA
 */
export const cmykToHsva = (cmyk: CmykColor): HsvaColor => {
  const rgba = cmykToRgba(cmyk)
  return rgbaToHsva(rgba)
}

/**
 * Convert CMYK color object to CMYK string
 */
export const cmykToCmykString = (cmyk: CmykColor): string => {
  const { c, m, y, k } = cmyk
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
}

/**
 * Convert CMYK string to CMYK color object
 */
export const cmykStringToCmyk = (cmykString: string): CmykColor => {
  const match = COLOR_PATTERNS.cmyk.exec(cmykString)

  if (!match) throw new Error(`Invalid CMYK color: ${cmykString}`)

  return {
    c: Number(match[1]),
    m: Number(match[2]),
    y: Number(match[3]),
    k: Number(match[4]),
  }
}
