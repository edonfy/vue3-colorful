import { describe, it, expect } from 'vitest'
import * as convert from '../src/utils/convert'

describe('Color Conversions', () => {
  describe('parseHue', () => {
    it('parses different angle units', () => {
      expect(convert.parseHue('100')).toBe(100)
      expect(convert.parseHue('200', 'grad')).toBe(180)
      expect(convert.parseHue('1', 'turn')).toBe(360)
      expect(convert.parseHue(Math.PI.toString(), 'rad')).toBe(180)
    })
  })

  describe('CMYK', () => {
    const black = { r: 0, g: 0, b: 0, a: 1 }
    const white = { r: 255, g: 255, b: 255, a: 1 }
    const red = { r: 255, g: 0, b: 0, a: 1 }

    it('converts RGBA to CMYK', () => {
      expect(convert.rgbaToCmyk(black)).toEqual({ c: 0, m: 0, y: 0, k: 100 })
      expect(convert.rgbaToCmyk(white)).toEqual({ c: 0, m: 0, y: 0, k: 0 })
      expect(convert.rgbaToCmyk(red)).toEqual({ c: 0, m: 100, y: 100, k: 0 })
    })

    it('converts CMYK to RGBA', () => {
      expect(convert.cmykToRgba({ c: 0, m: 0, y: 0, k: 100 })).toEqual(black)
      expect(convert.cmykToRgba({ c: 0, m: 0, y: 0, k: 0 })).toEqual(white)
      expect(convert.cmykToRgba({ c: 0, m: 100, y: 100, k: 0 })).toEqual(red)
    })

    it('converts HSVA to CMYK and back', () => {
      const hsva = { h: 0, s: 100, v: 100, a: 1 } // Red
      const cmyk = convert.hsvaToCmyk(hsva)
      expect(cmyk).toEqual({ c: 0, m: 100, y: 100, k: 0 })

      const hsvaBack = convert.cmykToHsva(cmyk)
      expect(hsvaBack.h).toBe(0)
      expect(hsvaBack.s).toBe(100)
      expect(hsvaBack.v).toBe(100)
    })

    it('converts CMYK string to object and back', () => {
      const str = 'cmyk(0%, 100%, 100%, 0%)'
      const obj = convert.cmykStringToCmyk(str)
      expect(obj).toEqual({ c: 0, m: 100, y: 100, k: 0 })
      expect(convert.cmykToCmykString(obj)).toBe(str)

      expect(convert.cmykStringToCmyk('invalid')).toEqual({ c: 0, m: 0, y: 0, k: 0 })
    })
  })

  describe('HSVA string conversions', () => {
    const hsva = { h: 180, s: 50, v: 50, a: 0.5 }

    it('converts to various strings', () => {
      expect(convert.hsvaToHsvString(hsva)).toBe('hsv(180, 50%, 50%)')
      expect(convert.hsvaToHsvaString(hsva)).toBe('hsva(180, 50%, 50%, 0.5)')
      expect(convert.hsvaToHslaString(hsva)).toBe('hsla(180, 33%, 38%, 0.5)')

      expect(convert.hsvaToRgbString(hsva)).toBe('rgb(64, 128, 128)')
      expect(convert.hsvaToRgbaString(hsva)).toBe('rgba(64, 128, 128, 0.5)')
    })

    it('parses strings back', () => {
      expect(convert.hslaStringToHsva('hsl(180, 50%, 38%)')).toMatchObject({ h: 180 })
      expect(convert.hsvaStringToHsva('hsv(180, 50%, 50%)')).toMatchObject({ h: 180, s: 50, v: 50 })
      expect(convert.rgbaStringToHsva('rgb(64, 128, 128)')).toMatchObject({ h: 180 })

      // Invalid strings should now throw errors
      expect(() => convert.hslaStringToHsva('invalid')).toThrow()
      expect(() => convert.hsvaStringToHsva('invalid')).toThrow()
      expect(() => convert.rgbaStringToHsva('invalid')).toThrow()
    })
  })

  describe('rgbaToHsva edge cases', () => {
    it('handles max === g', () => {
      const hsva = convert.rgbaStringToHsva('rgb(0, 255, 0)')
      expect(hsva.h).toBe(120)
    })

    it('handles max === b', () => {
      const hsva = convert.rgbaStringToHsva('rgb(0, 0, 255)')
      expect(hsva.h).toBe(240)
    })

    it('handles delta === 0', () => {
      const hsva = convert.rgbaStringToHsva('rgb(128, 128, 128)')
      expect(hsva.h).toBe(0)
      expect(hsva.s).toBe(0)
    })
  })

  describe('other utils', () => {
    it('rgbaToRgb and hslaToHsl', () => {
      expect(convert.rgbaToRgb({ r: 1, g: 2, b: 3, a: 0.5 })).toEqual({ r: 1, g: 2, b: 3 })
      expect(convert.hslaToHsl({ h: 1, s: 2, l: 3, a: 0.5 })).toEqual({ h: 1, s: 2, l: 3 })
      expect(convert.hsvaToHsv({ h: 1, s: 2, v: 3, a: 0.5 })).toEqual({ h: 1, s: 2, v: 3 })
    })
  })
})
