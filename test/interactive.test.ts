import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Interactive from '../src/color-picker/Interactive'
import { Interaction } from '../src/composables/useInteraction'

const mockRect = () =>
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

describe('Interactive', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => fn(Date.now()))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders correctly', () => {
    const wrapper = mount(Interactive)
    expect(wrapper.exists()).toBe(true)
  })

  it('triggers move on pointerdown', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(mockRect)

    el.element.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 50, clientY: 50, bubbles: true })
    )
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('move')).toBeTruthy()
    const emitted = wrapper.emitted('move')?.[0]?.[0] as Interaction
    expect(emitted.left).toBeCloseTo(0.5)
    expect(emitted.top).toBeCloseTo(0.5)
  })

  it('triggers move on pointermove after pointerdown', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(mockRect)

    el.element.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 10, clientY: 10, bubbles: true })
    )
    await wrapper.vm.$nextTick()

    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 90, clientY: 90, bubbles: true })
    )

    const emitted = wrapper.emitted('move')
    expect(emitted?.length).toBeGreaterThan(1)
    const lastEmitted = emitted?.[emitted.length - 1]?.[0] as Interaction
    expect(lastEmitted.left).toBeCloseTo(0.9)
  })

  it('stops listening on pointerup', async () => {
    const wrapper = mount(Interactive)
    const el = wrapper.find('.vue3-colorful__interactive')

    el.element.getBoundingClientRect = vi.fn(mockRect)

    el.element.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 10, clientY: 10, bubbles: true })
    )
    await wrapper.vm.$nextTick()

    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 90, clientY: 90, bubbles: true })
    )

    // Should not have a new move event after pointerup
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

    el.element.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 0, clientY: 200, bubbles: true })
    )
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('move')?.[0]?.[0] as Interaction
    expect(emitted.left).toBe(0)
    expect(emitted.top).toBe(1)
  })
})
