import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Hue from '../src/color-picker/Hue'

describe('Hue component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Hue, {
      props: { hue: 180 },
    })
    expect(wrapper.find('.vue3-colorful__hue').exists()).toBe(true)
  })

  it('renders vertically', () => {
    const wrapper = mount(Hue, {
      props: { hue: 180, vertical: true },
    })
    expect(wrapper.find('.vue3-colorful__hue--vertical').exists()).toBe(true)
  })

  describe('keyboard navigation', () => {
    it('ArrowRight increases hue by 1', async () => {
      const wrapper = mount(Hue, { props: { hue: 100 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(101)
    })

    it('ArrowLeft decreases hue by 1', async () => {
      const wrapper = mount(Hue, { props: { hue: 100 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(99)
    })

    it('Home key sets hue to 0', async () => {
      const wrapper = mount(Hue, { props: { hue: 180 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(0)
    })

    it('End key sets hue to 360', async () => {
      const wrapper = mount(Hue, { props: { hue: 180 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(360)
    })

    it('PageUp increases hue by 36', async () => {
      const wrapper = mount(Hue, { props: { hue: 100 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'PageUp' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(136)
    })

    it('PageDown decreases hue by 36', async () => {
      const wrapper = mount(Hue, { props: { hue: 100 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'PageDown' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(64)
    })

    it('Shift+ArrowRight increases hue by 36', async () => {
      const wrapper = mount(Hue, { props: { hue: 100 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(136)
    })

    it('wraps hue from 0 to 359 when decreasing', async () => {
      const wrapper = mount(Hue, { props: { hue: 0 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(359)
    })

    it('wraps hue from 359 to 0 when increasing', async () => {
      const wrapper = mount(Hue, { props: { hue: 359 } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(0)
    })

    it('ArrowUp decreases hue in vertical mode (up = lower on screen)', async () => {
      const wrapper = mount(Hue, { props: { hue: 100, vertical: true } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(99)
    })

    it('ArrowDown increases hue in vertical mode (down = higher on screen)', async () => {
      const wrapper = mount(Hue, { props: { hue: 100, vertical: true } })
      const interactive = wrapper.find('.vue3-colorful__interactive')
      await interactive.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe(101)
    })
  })
})
