import { HslaColor, HsvaColor } from '@/types'

export const round = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
  return Math.round(base * number) / base
}


export const hsvaToHsla = ({ h, s, v, a }: HsvaColor): HslaColor => {
  const hh = ((200 - s) * v) / 100

  return {
    h: round(h),
    s: round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
    l: round(hh / 2),
    a: round(a, 2),
  }
}

export const hsvaToHslString = (hsva: HsvaColor): string => {
  const { h, s, l } = hsvaToHsla(hsva)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export const hsvaToHslaString = (hsva: HsvaColor): string => {
  const { h, s, l, a } = hsvaToHsla(hsva)
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}