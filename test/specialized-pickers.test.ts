import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HexColorPicker from '../src/color-picker/HexColorPicker'
import RgbColorPicker from '../src/color-picker/RgbColorPicker'
import HslColorPicker from '../src/color-picker/HslColorPicker'
import HsvColorPicker from '../src/color-picker/HsvColorPicker'
import HwbColorPicker from '../src/color-picker/HwbColorPicker'
import CmykColorPicker from '../src/color-picker/CmykColorPicker'

import { nextTick } from 'vue'

describe('Specialized Pickers', () => {
  it('HexColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(HexColorPicker, {
      props: {
        modelValue: '#ff0000',
        showAlpha: true,
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    // Find BasePicker and trigger events
    const base = wrapper.findComponent({ name: 'BasePicker' })

    // Change Hue to 180 (Cyan)
    await base.vm.$emit('hueChange', 180)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('#00ffff')

    // Change Alpha to 0.5
    await base.vm.$emit('alphaChange', 0.5)
    await base.vm.$emit('alphaChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('#00ffff80')

    // Change Saturation/Value
    await base.vm.$emit('saturationChange', { s: 50, v: 50 })
    await base.vm.$emit('saturationChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('#40808080')
  })

  it('RgbColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(RgbColorPicker, {
      props: {
        modelValue: 'rgb(255, 0, 0)',
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120) // Green
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('rgb(0, 255, 0)')
  })

  it('RgbColorPicker supports object values', async () => {
    let updatedValue: unknown = null
    const wrapper = mount(RgbColorPicker, {
      props: {
        modelValue: { r: 255, g: 0, b: 0 },
        valueType: 'object',
        'onUpdate:modelValue': (val: unknown) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('HslColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(HslColorPicker, {
      props: {
        modelValue: 'hsl(0, 100%, 50%)',
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })
    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('hsl(120, 100%, 50%)')
  })

  it('HslColorPicker supports object values', async () => {
    let updatedValue: unknown = null
    const wrapper = mount(HslColorPicker, {
      props: {
        modelValue: { h: 0, s: 100, l: 50 },
        valueType: 'object',
        'onUpdate:modelValue': (val: unknown) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('HsvColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(HsvColorPicker, {
      props: {
        modelValue: 'hsv(0, 100%, 100%)',
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })
    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('hsv(120, 100%, 100%)')
  })

  it('HsvColorPicker supports HSVA object values', async () => {
    let updatedValue: unknown = null
    const wrapper = mount(HsvColorPicker, {
      props: {
        modelValue: { h: 0, s: 100, v: 100, a: 1 },
        valueType: 'object',
        showAlpha: true,
        'onUpdate:modelValue': (val: unknown) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('alphaChange', 0.5)
    await base.vm.$emit('alphaChangeComplete')
    await nextTick()
    expect(updatedValue).toEqual({ h: 0, s: 100, v: 100, a: 0.5 })
  })

  it('HwbColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(HwbColorPicker, {
      props: {
        modelValue: 'hwb(0 0% 0%)',
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('hwb(120 0% 0%)')
  })

  it('CmykColorPicker should update on interaction', async () => {
    let updatedValue = ''
    const wrapper = mount(CmykColorPicker, {
      props: {
        modelValue: 'cmyk(0%, 100%, 100%, 0%)',
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })
    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 120)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('cmyk(100%, 0%, 100%, 0%)')
  })

  it('All pickers should handle eyedropper selection', async () => {
    let updatedValue = ''
    const wrapper = mount(HexColorPicker, {
      props: {
        modelValue: '#000000',
        showEyedropper: true,
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('colorSelect', '#ff00ff')
    await nextTick()
    expect(updatedValue).toBe('#ff00ff')
  })

  it('All pickers should handle manual input', async () => {
    let updatedValue = ''
    const wrapper = mount(HexColorPicker, {
      props: {
        modelValue: '#000000',
        showInput: true,
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const input = wrapper.find('.vue3-colorful__input')
    expect(input.exists()).toBe(true)

    await input.setValue('#00ff00')
    await new Promise((r) => setTimeout(r, 150))
    await nextTick()
    expect(updatedValue).toBe('#00ff00')
  })

  it('All pickers should handle vertical orientation', async () => {
    let updatedValue = ''
    const wrapper = mount(HexColorPicker, {
      props: {
        modelValue: '#ff0000', // red, h=0
        vertical: true,
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('hueChange', 180)
    await base.vm.$emit('hueChangeComplete')
    await nextTick()
    expect(updatedValue).toBe('#00ffff')
  })

  it('All pickers should handle preset selection', async () => {
    let updatedValue = ''
    const wrapper = mount(HexColorPicker, {
      props: {
        modelValue: '#000000',
        presets: ['#ffffff'],
        'onUpdate:modelValue': (val: string) => (updatedValue = val),
      },
    })

    const base = wrapper.findComponent({ name: 'BasePicker' })
    await base.vm.$emit('colorSelect', '#ffffff')
    expect(updatedValue).toBe('#ffffff')
  })
})
