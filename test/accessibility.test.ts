import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { HsvaColor } from '../src/types'
import ColorPicker from '../src/color-picker/ColorPicker'
import Hue from '../src/color-picker/Hue'
import Saturation from '../src/color-picker/Saturation'
import Alpha from '../src/color-picker/Alpha'

describe('Accessibility', () => {
  describe('Hue Keyboard Navigation', () => {
    it('increases hue on ArrowRight', async () => {
      const wrapper = mount(Hue, {
        props: { hue: 0 },
      })
      const interactive = wrapper.find('[role="slider"]')

      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBeGreaterThan(0)
    })

    it('decreases hue on ArrowLeft', async () => {
      const wrapper = mount(Hue, {
        props: { hue: 180 },
      })
      const interactive = wrapper.find('[role="slider"]')
      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBeLessThan(180)
    })

    it('jumps hue on Shift + ArrowRight', async () => {
      const wrapper = mount(Hue, {
        props: { hue: 0 },
      })
      const interactive = wrapper.find('[role="slider"]')
      await interactive.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(36)
    })

    it('wraps hue from 0 to 359 on ArrowLeft', async () => {
      const wrapper = mount(Hue, {
        props: { hue: 0 },
      })
      const interactive = wrapper.find('[role="slider"]')
      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(359)
    })

    it('wraps hue from 359 to 0 on ArrowRight', async () => {
      const wrapper = mount(Hue, {
        props: { hue: 359 },
      })
      const interactive = wrapper.find('[role="slider"]')
      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(0)
    })
  })

  describe('Saturation Keyboard Navigation', () => {
    it('updates saturation on ArrowRight/Left', async () => {
      const wrapper = mount(Saturation, {
        props: { hsva: { h: 0, s: 50, v: 50, a: 1 } },
      })
      const interactive = wrapper.find('[role="slider"]')

      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect((wrapper.emitted('change')?.[0]?.[0] as HsvaColor).s).toBe(51)

      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect((wrapper.emitted('change')?.[1]?.[0] as HsvaColor).s).toBe(49)
    })

    it('updates brightness on ArrowUp/Down', async () => {
      const wrapper = mount(Saturation, {
        props: { hsva: { h: 0, s: 50, v: 50, a: 1 } },
      })
      const interactive = wrapper.find('[role="slider"]')

      await interactive.trigger('keydown', { key: 'ArrowUp' })
      expect((wrapper.emitted('change')?.[0]?.[0] as HsvaColor).v).toBe(51)

      await interactive.trigger('keydown', { key: 'ArrowDown' })
      expect((wrapper.emitted('change')?.[1]?.[0] as HsvaColor).v).toBe(49)
    })
  })

  describe('Alpha Keyboard Navigation', () => {
    it('updates alpha on ArrowRight/Left', async () => {
      const wrapper = mount(Alpha, {
        props: { hsva: { h: 0, s: 100, v: 100, a: 0.5 } },
      })
      const interactive = wrapper.find('[role="slider"]')

      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBeCloseTo(0.51)

      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('change')?.[1]?.[0]).toBeCloseTo(0.49)
    })
  })

  describe('ARIA attributes', () => {
    it('exposes saturation slider min/max metadata', () => {
      const wrapper = mount(Saturation, {
        props: { hsva: { h: 0, s: 50, v: 50, a: 1 } },
      })

      const slider = wrapper.find('[role="slider"]')

      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
      expect(slider.attributes('aria-valuenow')).toBe('50')
    })

    it('has correct ARIA roles and labels', () => {
      const wrapper = mount(ColorPicker, {
        props: { showAlpha: true },
      })

      const sliders = wrapper.findAll('[role="slider"]')
      expect(sliders).toHaveLength(3) // Saturation, Hue, Alpha

      expect(wrapper.find('.vue3-colorful__hue [role="slider"]').attributes('aria-label')).toBe(
        'Hue'
      )
      expect(wrapper.find('.vue3-colorful__hue [role="slider"]').attributes('aria-valuemax')).toBe(
        '360'
      )
      expect(wrapper.find('.vue3-colorful__alpha [role="slider"]').attributes('aria-label')).toBe(
        'Alpha'
      )
    })

    it('marks controls as disabled when picker is disabled', () => {
      const wrapper = mount(ColorPicker, {
        props: { disabled: true, showInput: true },
      })

      const slider = wrapper.find('.vue3-colorful__hue [role="slider"]')
      const input = wrapper.find('input')

      expect(slider.attributes('aria-disabled')).toBe('true')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('marks controls as read-only when picker is readOnly', () => {
      const wrapper = mount(ColorPicker, {
        props: { readOnly: true, showInput: true },
      })

      const slider = wrapper.find('.vue3-colorful__hue [role="slider"]')
      const input = wrapper.find('input')

      expect(slider.attributes('aria-readonly')).toBe('true')
      expect(input.attributes('readonly')).toBeDefined()
      expect(input.attributes('aria-readonly')).toBe('true')
    })
  })
})
