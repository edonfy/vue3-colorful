import { hsvaToRgba } from './convert'
import { parseColor } from './converter'

const toLinearChannel = (channel: number): number => {
  const normalizedChannel = channel / 255

  if (normalizedChannel <= 0.03928) {
    return normalizedChannel / 12.92
  }

  return ((normalizedChannel + 0.055) / 1.055) ** 2.4
}

export const getRelativeLuminance = (color: string): number => {
  const rgba = hsvaToRgba(parseColor(color))

  const red = toLinearChannel(rgba.r)
  const green = toLinearChannel(rgba.g)
  const blue = toLinearChannel(rgba.b)

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export const getContrastRatio = (foreground: string, background: string): number => {
  const foregroundLuminance = getRelativeLuminance(foreground)
  const backgroundLuminance = getRelativeLuminance(background)

  const lighterLuminance = Math.max(foregroundLuminance, backgroundLuminance)
  const darkerLuminance = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05)
}
