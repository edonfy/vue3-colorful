import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ColorPickerPopover from '../src/color-picker/ColorPickerPopover'

// Mock useFloating from @floating-ui/vue
vi.mock('@floating-ui/vue', () => ({
  useFloating: () => ({
    x: { value: 100 },
    y: { value: 200 },
    floatingStyles: { value: { top: '200px', left: '100px' } },
    isPositioned: { value: true },
  }),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn(),
  autoUpdate: vi.fn(),
}))

describe('ColorPickerPopover', () => {
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
    // Open it
    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(true)

    // Simulate click outside
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
})
