import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPicker } from '../src/color-picker/PickerFactory'

describe('PickerFactory - createPicker', () => {
  it('creates a functional component with the given model', async () => {
    const HexPicker = createPicker('HexPicker', 'hex')
    const wrapper = mount(HexPicker, {
      props: {
        modelValue: '#ff0000',
      },
    })

    expect(HexPicker.name).toBe('HexPicker')
    expect(wrapper.find('.vue3-colorful').exists()).toBe(true)

    // Check if it renders the Hex value in ColorInput if showInput is true
    await wrapper.setProps({ showInput: true, colorLabel: 'HEX' })
    expect(wrapper.find('.vue3-colorful__input').element.getAttribute('value')).toBe('#ff0000')
  })

  it('handles invalid modelValue gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const HexPicker = createPicker('HexPicker', 'hex')

    const wrapper = mount(HexPicker, {
      props: {
        modelValue: '#ffffff',
      },
    })

    await wrapper.setProps({ modelValue: 'invalid-color' })

    // We wait multiple ticks to be sure watchers have finished
    await nextTick()
    await nextTick()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('reacts to alpha changes', async () => {
    const RgbPicker = createPicker('RgbPicker', 'rgb')
    const wrapper = mount(RgbPicker, {
      props: {
        modelValue: 'rgb(255, 0, 0)',
        showAlpha: true,
      },
    })

    const interactives = wrapper.findAll('.vue3-colorful__interactive')
    expect(interactives.length).toBe(3) // Saturation, Hue, Alpha
  })

  it('detects internal vs external updates to prevent loops', async () => {
    const HexPicker = createPicker('HexPicker', 'hex')
    const wrapper = mount(HexPicker, {
      props: {
        modelValue: '#ff0000',
      },
    })

    // Initial emit due to immediate: true
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    // External update should update state and emit back
    await wrapper.setProps({ modelValue: '#00ff00' })

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]?.[0]).toBe('#00ff00')
  })
})
