import './style.css'

import ColorPicker from './color-picker'
export { default as ColorPickerPanel } from './color-picker/ColorPickerPanel'
export { default as HexColorInput } from './color-picker/HexColorInput'
export { default as HexColorPicker } from './color-picker/HexColorPicker'
export { default as RgbColorPicker } from './color-picker/RgbColorPicker'
export { default as HslColorPicker } from './color-picker/HslColorPicker'
export { default as HsvColorPicker } from './color-picker/HsvColorPicker'
export { default as HwbColorPicker } from './color-picker/HwbColorPicker'
export { default as CmykColorPicker } from './color-picker/CmykColorPicker'

export * from './types'

export const VERSION = __VERSION__

export { ColorPicker }

export default ColorPicker
