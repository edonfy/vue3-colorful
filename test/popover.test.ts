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

// ColorPickerPopover exposes isOpen via expose()
interface PopoverExposed {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  focusTrigger: () => Promise<void>
}

const isOpen = (vm: unknown): boolean => (vm as PopoverExposed).isOpen

describe('ColorPickerPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders trigger by default', () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    expect(wrapper.find('button.vue3-colorful__swatch-trigger').exists()).toBe(true)
    expect(wrapper.find('.vue3-colorful-theme').exists()).toBe(true)
  })

  it('toggles visibility on click', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    const trigger = wrapper.find('.vue3-colorful__popover-trigger')
    await trigger.trigger('click')
    expect(isOpen(wrapper.vm)).toBe(true)

    await trigger.trigger('click')
    expect(isOpen(wrapper.vm)).toBe(false)
  })

  it('supports the expose control methods', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      attachTo: document.body,
    })

    ;(wrapper.vm as PopoverExposed).open()
    await wrapper.vm.$nextTick()
    expect(isOpen(wrapper.vm)).toBe(true)
    ;(wrapper.vm as PopoverExposed).toggle()
    await wrapper.vm.$nextTick()
    expect(isOpen(wrapper.vm)).toBe(false)
    ;(wrapper.vm as PopoverExposed).open()
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as PopoverExposed).close()
    await wrapper.vm.$nextTick()
    expect(isOpen(wrapper.vm)).toBe(false)

    await (wrapper.vm as PopoverExposed).focusTrigger()
    expect(document.activeElement).not.toBeNull()
  })

  it('closes on click outside', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
    })
    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect(isOpen(wrapper.vm)).toBe(true)

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(isOpen(wrapper.vm)).toBe(false)
  })

  it('uses the custom slot root as the trigger element', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      slots: {
        default: '<button class="custom-trigger">Click me</button>',
      },
    })

    const trigger = wrapper.find('button.custom-trigger')

    expect(trigger.exists()).toBe(true)
    expect(trigger.classes()).toContain('vue3-colorful__popover-trigger')
    expect(trigger.attributes('role')).toBeUndefined()
    expect(trigger.attributes('type')).toBe('button')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    expect(wrapper.findAll('.vue3-colorful__popover-trigger')).toHaveLength(1)

    await trigger.trigger('click')
    expect(isOpen(wrapper.vm)).toBe(true)
  })

  it('falls back to the legacy trigger without throwing when process is unavailable', () => {
    vi.stubGlobal('process', undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const mountPopover = () =>
      mount(ColorPickerPopover, {
        props: { modelValue: '#ffffff' },
        slots: {
          default: '<span>Invalid</span><span>Trigger</span>',
        },
      })

    expect(mountPopover).not.toThrow()

    const wrapper = mountPopover()
    const trigger = wrapper.find('.vue3-colorful__popover-trigger')

    expect(trigger.exists()).toBe(true)
    expect(trigger.element.tagName).toBe('DIV')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff', disabled: true },
    })

    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect(isOpen(wrapper.vm)).toBe(false)
    expect(wrapper.find('.vue3-colorful__popover-trigger').attributes('aria-disabled')).toBe('true')
  })

  it('links the default trigger and panel with dialog semantics', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.vue3-colorful__popover-trigger')
    expect(trigger.element.tagName).toBe('BUTTON')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')

    await trigger.trigger('click')
    await wrapper.vm.$nextTick()

    const content = document.body.querySelector('.vue3-colorful__popover-content')
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(content?.getAttribute('id')).toBe(trigger.attributes('aria-controls'))
  })

  it('applies theme host classes to wrapper and teleported content', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff', dark: true },
      attachTo: document.body,
    })

    expect(wrapper.find('.vue3-colorful__popover-wrapper').classes()).toContain(
      'vue3-colorful-theme'
    )
    expect(wrapper.find('.vue3-colorful__popover-wrapper').classes()).toContain(
      'vue3-colorful-theme--dark'
    )

    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    await wrapper.vm.$nextTick()

    const content = document.body.querySelector('.vue3-colorful__popover-content')

    expect(content).not.toBeNull()
    expect(content?.classList.contains('vue3-colorful-theme')).toBe(true)
    expect(content?.classList.contains('vue3-colorful-theme--dark')).toBe(true)
  })

  it('closes on Escape key', async () => {
    const wrapper = mount(ColorPickerPopover, {
      props: { modelValue: '#ffffff' },
      attachTo: document.body,
    })

    await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
    expect(isOpen(wrapper.vm)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(isOpen(wrapper.vm)).toBe(false)

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
      expect(isOpen(wrapper.vm)).toBe(true)

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

      await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
      vi.runAllTimers()
      await wrapper.vm.$nextTick()

      let content = document.body.querySelector('.vue3-colorful__popover-content')
      expect(content).not.toBeNull()

      await wrapper.find('.vue3-colorful__popover-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      content = document.body.querySelector('.vue3-colorful__popover-content')
      expect(content).not.toBeNull()
      expect(content!.getAttribute('data-status')).toBe('close')

      content!.dispatchEvent(new Event('transitionend'))
      await wrapper.vm.$nextTick()

      expect(document.body.querySelector('.vue3-colorful__popover-content')).toBeNull()

      vi.useRealTimers()
    })
  })
})
