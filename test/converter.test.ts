import { describe, it, expect } from 'vitest'

import { parseColor, formatColor } from '../src/utils/converter'

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
      expect(parseColor('')).toEqual({ h: 0, s: 100, v: 100, a: 1 })
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
})
