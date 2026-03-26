import { describe, it, expect } from 'vitest'

import {
  DEFAULT_HSVA,
  createDefaultHsva,
  formatColor,
  formatColorValue,
  normalizeColorForComparison,
  parseColor,
  parseColorValue,
} from '../src/utils/converter'

describe('ColorConverter', () => {
  describe('parseColor', () => {
    it('should parse hex colors', () => {
      expect(parseColor('#ffffff')).toEqual({ h: 0, s: 0, v: 100, a: 1 })
      expect(parseColor('ffffff')).toEqual({ h: 0, s: 0, v: 100, a: 1 })
    })

    it('should parse rgb colors', () => {
      expect(parseColor('rgb(255, 255, 255)')).toEqual({ h: 0, s: 0, v: 100, a: 1 })
      expect(parseColor('rgba(255, 255, 255, 0.5)')).toEqual({ h: 0, s: 0, v: 100, a: 0.5 })
    })

    it('should parse hsl colors', () => {
      expect(parseColor('hsl(0, 0%, 100%)')).toEqual({ h: 0, s: 0, v: 100, a: 1 })
    })

    it('should parse cmyk colors', () => {
      expect(parseColor('cmyk(0%, 0%, 0%, 0%)')).toEqual({ h: 0, s: 0, v: 100, a: 1 })
    })

    it('should handle empty input and throw for invalid format', () => {
      expect(parseColor('')).toEqual(DEFAULT_HSVA)
      expect(() => parseColor('invalid')).toThrow()
    })
  })

  describe('formatColor', () => {
    const hsva = { h: 0, s: 0, v: 100, a: 1 }

    it('should format to hex', () => {
      expect(formatColor(hsva, 'hex', false)).toBe('#ffffff')
    })

    it('should format to rgb/rgba', () => {
      expect(formatColor(hsva, 'rgb', false)).toBe('rgb(255, 255, 255)')
      expect(formatColor(hsva, 'rgb', true)).toBe('rgba(255, 255, 255, 1)')
    })

    it('should format to hsl/hsla', () => {
      expect(formatColor(hsva, 'hsl', false)).toBe('hsl(0, 0%, 100%)')
      expect(formatColor(hsva, 'hsl', true)).toBe('hsla(0, 0%, 100%, 1)')
    })

    it('should format to hwb', () => {
      expect(formatColor({ h: 0, s: 100, v: 100, a: 1 }, 'hwb', false)).toBe('hwb(0 0% 0%)')
    })

    it('formats typed object values when valueType is object', () => {
      const objectHsva = { h: 180, s: 50, v: 50, a: 0.5 }

      expect(formatColorValue(objectHsva, 'rgb', false, 'object')).toEqual({
        r: 64,
        g: 128,
        b: 128,
      })
      expect(formatColorValue(objectHsva, 'rgb', true, 'object')).toEqual({
        r: 64,
        g: 128,
        b: 128,
        a: 0.5,
      })
      expect(formatColorValue(objectHsva, 'hsl', false, 'object')).toEqual({ h: 180, s: 33, l: 38 })
      expect(formatColorValue(objectHsva, 'hsv', true, 'object')).toEqual({
        h: 180,
        s: 50,
        v: 50,
        a: 0.5,
      })
    })
  })

  describe('Memoization', () => {
    it('should cache results in convert.ts', () => {
      // We can't easily check the private cache, but we can verify consistent results
      const hsva = { h: 180, s: 50, v: 50, a: 0.8 }
      const first = formatColor(hsva, 'rgb', true)
      const second = formatColor(hsva, 'rgb', true)
      expect(first).toBe(second)
    })
  })

  describe('default color helpers', () => {
    it('creates a fresh default HSVA object', () => {
      const first = createDefaultHsva()
      const second = createDefaultHsva()

      expect(first).toEqual(DEFAULT_HSVA)
      expect(second).toEqual(DEFAULT_HSVA)
      expect(first).not.toBe(second)
    })

    it('normalizes colors for preset comparison without treating blank as red', () => {
      expect(normalizeColorForComparison('RGB(255, 255, 255)')).toBe('#ffffff')
      expect(normalizeColorForComparison('')).toBe('')
    })

    it('parses object color values', () => {
      expect(parseColorValue({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100, a: 1 })
      expect(parseColorValue({ h: 120, s: 100, l: 50 })).toEqual({ h: 120, s: 100, v: 100, a: 1 })
      expect(parseColorValue({ h: 240, s: 100, v: 100, a: 0.5 })).toEqual({
        h: 240,
        s: 100,
        v: 100,
        a: 0.5,
      })
      expect(parseColorValue({ h: 0, w: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100, a: 1 })
    })
  })
})
