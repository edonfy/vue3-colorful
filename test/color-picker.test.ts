import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '../src/color-picker/ColorPicker'

describe('ColorPicker', () => {
  describe('rendering', () => {
    it('renders correctly', () => {
      const wrapper = mount(ColorPicker)
      expect(wrapper.find('.vue3-colorful').exists()).toBe(true)
    })

    it('shows alpha slider when showAlpha is true', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          showAlpha: true,
        },
      })
      expect(wrapper.find('.vue3-colorful__alpha').exists()).toBe(true)
    })

    it('hides alpha slider when showAlpha is false', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          showAlpha: false,
        },
      })
      expect(wrapper.find('.vue3-colorful__alpha').exists()).toBe(false)
    })
  })

  describe('colorModel prop', () => {
    it('emits hex format by default', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^#[0-9a-f]{6}$/)
    })

    it('emits rgb format when colorModel is rgb', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          colorModel: 'rgb',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^rgb\(/)
    })

    it('emits hsl format when colorModel is hsl', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          colorModel: 'hsl',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^hsl\(/)
    })

    it('emits hsv format when colorModel is hsv', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          colorModel: 'hsv',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^hsv\(/)
    })

    it('emits cmyk format when colorModel is cmyk', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          colorModel: 'cmyk',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^cmyk\(/)
    })
  })

  describe('modelValue input', () => {
    it('parses hex color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#00ff00',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('parses rgb color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'rgb(0, 255, 0)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('parses hsl color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'hsl(120, 100%, 50%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('parses hsv color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'hsv(120, 100%, 100%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('parses cmyk color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'cmyk(100%, 0%, 100%, 0%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('handles invalid color input gracefully', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'invalid-color',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('events', () => {
    it('emits update:modelValue on hue change', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emits update:modelValue on saturation change', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
        },
      })
      const saturationComponent = wrapper.findComponent({ name: 'Saturation' })
      await saturationComponent.vm.$emit('change', { s: 50, v: 50 })
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emits update:modelValue on alpha change', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          showAlpha: true,
        },
      })
      const alphaComponent = wrapper.findComponent({ name: 'Alpha' })
      await alphaComponent.vm.$emit('change', 0.5)
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })
})
