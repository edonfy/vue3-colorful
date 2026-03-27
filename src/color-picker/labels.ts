import { ColorPickerLabels } from '../types'

export const defaultColorPickerLabels: ColorPickerLabels = Object.freeze({
  colorInput: 'Color value',
  clearColor: 'Clear color',
  invalidColorFormat: 'Invalid color format',
  chooseColor: 'Choose color',
  pickColorFromScreen: 'Pick color from screen',
  eyedropperUnsupported: 'EyeDropper not supported in this browser',
})

export const getColorPickerLabel = (
  labels: Partial<ColorPickerLabels> | undefined,
  key: keyof ColorPickerLabels
): string => labels?.[key] ?? defaultColorPickerLabels[key]
