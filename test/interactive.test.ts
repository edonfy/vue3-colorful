import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Interactive, { Interaction } from '../src/color-picker/Interactive'

describe('Interactive', () => {
  it('renders correctly', () => {
    const wrapper = mount(Interactive)
    expect(wrapper.exists()).toBe(true)
  })

  it('triggers move on mousedown', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    // Mock getBoundingClientRect
    el.element.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect
    )

    await el.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
      button: 0,
    })

    expect(wrapper.emitted('move')).toBeTruthy()
    const emitted = wrapper.emitted('move')?.[0]?.[0] as Interaction
    expect(emitted.left).toBeCloseTo(0.5)
    expect(emitted.top).toBeCloseTo(0.5)
  })

  it('triggers move on mousemove after mousedown', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect
    )

    await el.trigger('mousedown', { clientX: 10, clientY: 10, button: 0 })

    const moveEvent = new MouseEvent('mousemove', {
      clientX: 90,
      clientY: 90,
      bubbles: true,
    })
    window.dispatchEvent(moveEvent)

    const emitted = wrapper.emitted('move')
    expect(emitted?.length).toBeGreaterThan(1)
    const lastEmitted = emitted?.[emitted.length - 1]?.[0] as Interaction
    expect(lastEmitted.left).toBeCloseTo(0.9)
  })

  it('stops listening on mouseup', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect
    )

    await el.trigger('mousedown', { clientX: 10, clientY: 10, button: 0 })
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    const moveEvent = new MouseEvent('mousemove', { clientX: 90, clientY: 90, bubbles: true })
    window.dispatchEvent(moveEvent)

    // Should not have a new move event after mouseup
    expect(wrapper.emitted('move')?.length).toBe(1)
  })

  it('clamps coordinates to [0, 1]', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 10,
          top: 10,
          width: 100,
          height: 100,
          bottom: 110,
          right: 110,
          x: 10,
          y: 10,
          toJSON: () => {},
        }) as DOMRect
    )

    await el.trigger('mousedown', { clientX: 0, clientY: 200, button: 0 })

    const emitted = wrapper.emitted('move')?.[0]?.[0] as Interaction
    expect(emitted.left).toBe(0)
    expect(emitted.top).toBe(1)
  })
})
