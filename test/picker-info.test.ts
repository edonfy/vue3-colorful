import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import ColorPickerPanel from '../src/color-picker/ColorPickerPanel'

describe('Picker info features', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })

  it('renders copy actions and contrast information', () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        copyFormats: ['hex', 'rgb'],
        showContrast: true,
      },
    })

    expect(wrapper.findAll('.vue3-colorful__copy-button')).toHaveLength(2)
    expect(wrapper.text()).toContain('Contrast')
    expect(wrapper.text()).toContain('White')
    expect(wrapper.text()).toContain('Black')
  })

  it('copies the selected formatted value', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        copyFormats: ['hex'],
      },
    })

    await wrapper.find('.vue3-colorful__copy-button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#3b82f5')
    expect(wrapper.find('.vue3-colorful__copy-button').text()).toBe('HEX Copied')
    expect(wrapper.find('.vue3-colorful__copy-button').classes()).toContain(
      'vue3-colorful__copy-button--copied'
    )
    expect(wrapper.find('.vue3-colorful__copy-button').attributes('aria-label')).toBe(
      'HEX value copied'
    )
  })

  it('collects recent colors on committed changes', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#ff0000',
        showRecent: true,
        presets: ['#ffffff'],
      },
    })

    const hueComponent = wrapper.findComponent({ name: 'Hue' })
    await hueComponent.vm.$emit('change', 120)
    await hueComponent.vm.$emit('changeComplete')

    expect(wrapper.text()).toContain('Recent')
    expect(wrapper.findAll('.vue3-colorful__preset')).toHaveLength(2)
  })
})
