import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ColorPickerPopover from '../src/color-picker/ColorPickerPopover'

// Mock useFloating from @floating-ui/vue
vi.mock('@floating-ui/vue', () => ({
  useFloating: () => ({
    floatingStyles: { value: { top: '200px', left: '100px' } },
  }),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn(),
  autoUpdate: vi.fn(),
}))

describe('ColorPickerPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders trigger by default', () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    expect(wrapper.find('.vue3-colorful__swatch-trigger').exists()).toBe(true)
  })

  it('toggles visibility on click', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    const trigger = wrapper.find('.vue3-colorful__popover-trigger')
    await trigger.trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(true)

    await trigger.trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(false)
  })

  it('closes on click outside', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(true)

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect((wrapper.vm as any).isOpen).toBe(false)
  })

  it('uses custom slots for trigger', () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      slots: {
        default: '<button class="custom-trigger">Click me</button>',
      },
    })
    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
  })

  it('closes on Escape key', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      attachTo: document.body,
    })

    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect((wrapper.vm as any).isOpen).toBe(false)

    wrapper.unmount()
  })

  describe('animation status', () => {
    it('popover is not mounted when closed', () => {
      mount(ColorPickerPopover, {
        props: { modelValue: '#ffffff' },
      })
      expect(document.body.querySelector('.vue3-colorful__popover-content')).toBeNull()
    })

    it('popover mounts with initial status then transitions to open', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorPickerPopover, {
        props: { modelValue: '#ffffff' },
      })

      await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
      expect((wrapper.vm as any).isOpen).toBe(true)

      // After click, useTransitionStatus sets status='initial' synchronously
      // Then calls requestAnimationFrame (mocked by fake timers)
      // Flush all timers to execute nested RAF callbacks
      vi.runAllTimers()
      await wrapper.vm.$nextTick()

      const content = document.body.querySelector('.vue3-colorful__popover-content')
      expect(content).not.toBeNull()
      expect(content!.getAttribute('data-status')).toBe('open')

      vi.useRealTimers()
    })

    it('popover transitions to close status then unmounts on transitionend', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorPickerPopover, {
        props: { modelValue: '#ffffff' },
      })

      // Open and flush animations
      await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
      vi.runAllTimers()
      await wrapper.vm.$nextTick()

      let content = document.body.querySelector('.vue3-colorful__popover-content')
      expect(content).not.toBeNull()

      // Close
      await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      content = document.body.querySelector('.vue3-colorful__popover-content')
      expect(content).not.toBeNull()
      expect(content!.getAttribute('data-status')).toBe('close')

      // Simulate transitionend to trigger unmount
      content!.dispatchEvent(new Event('transitionend'))
      await wrapper.vm.$nextTick()

      expect(document.body.querySelector('.vue3-colorful__popover-content')).toBeNull()

      vi.useRealTimers()
    })
  })
})
