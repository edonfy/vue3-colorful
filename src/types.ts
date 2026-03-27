export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface RgbaColor extends RgbColor {
  a: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

export interface HslaColor extends HslColor {
  a: number
}

export interface HsvColor {
  h: number
  s: number
  v: number
}

export interface HsvaColor extends HsvColor {
  a: number
}

export interface HwbColor {
  h: number
  w: number
  b: number
}

export interface HwbaColor extends HwbColor {
  a: number
}

export interface CmykColor {
  c: number
  m: number
  y: number
  k: number
}

export interface PresetSwatch {
  value: string
  label?: string
}

export type PresetCollectionItem = string | PresetSwatch

export interface ColorPickerLabels {
  colorInput: string
  clearColor: string
  invalidColorFormat: string
  chooseColor: string
  pickColorFromScreen: string
  eyedropperUnsupported: string
}

export type ObjectColor =
  | RgbColor
  | HslColor
  | HsvColor
  | RgbaColor
  | HslaColor
  | HsvaColor
  | HwbColor
  | HwbaColor
  | CmykColor

export type AnyColor = string | ObjectColor

export type ColorModel = 'hex' | 'rgb' | 'hsv' | 'hsl' | 'hwb' | 'cmyk'

export type ColorValueType = 'string' | 'object'
