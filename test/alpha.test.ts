import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Alpha from '../src/color-picker/Alpha'

describe('Alpha component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Alpha, {
      props: {
        hsva: { h: 0, s: 100, v: 100, a: 1 },
      },
    })
    expect(wrapper.find('.vue3-colorful__alpha').exists()).toBe(true)
  })

  it('renders vertically', () => {
    const wrapper = mount(Alpha, {
      props: {
        hsva: { h: 0, s: 100, v: 100, a: 1 },
        vertical: true,
      },
    })
    expect(wrapper.find('.vue3-colorful__alpha--vertical').exists()).toBe(true)
  })

  it('emits change on key events', async () => {
    const wrapper = mount(Alpha, {
      props: {
        hsva: { h: 0, s: 100, v: 100, a: 0.5 },
      },
    })
    const interactive = wrapper.find('.vue3-colorful__interactive')

    // Test Home key
    await interactive.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(0)

    // Test End key
    await interactive.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('change')?.[1]?.[0]).toBe(1)

    // Test Arrow keys
    await interactive.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('change')?.[2]?.[0]).toBeLessThan(0.5)
  })
})
