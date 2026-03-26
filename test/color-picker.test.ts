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
      await hueComponent.vm.$emit('changeComplete')
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
      await hueComponent.vm.$emit('changeComplete')
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
      await hueComponent.vm.$emit('changeComplete')
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
      await hueComponent.vm.$emit('changeComplete')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^hsv\(/)
    })

    it('emits hwb format when colorModel is hwb', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          colorModel: 'hwb',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      await hueComponent.vm.$emit('changeComplete')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatch(/^hwb\(/)
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
      await hueComponent.vm.$emit('changeComplete')
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
      // Should NOT emit on mount if value is valid
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('parses rgb color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'rgb(0, 255, 0)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('parses hsl color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'hsl(120, 100%, 50%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('parses hsv color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'hsv(120, 100%, 100%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('parses cmyk color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'cmyk(100%, 0%, 100%, 0%)',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('parses short hex color input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#0f0',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('ColorInput handles empty and invalid updates and blur', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ffffff',
          showInput: true,
        },
      })
      const input = wrapper.find('input')

      // Invalid input
      await input.setValue('invalid')
      await new Promise((r) => setTimeout(r, 150))
      expect(input.attributes('aria-invalid')).toBe('true')

      // Empty input
      await input.setValue('')
      expect(input.attributes('aria-invalid')).toBe('false')

      // Trim on blur
      await input.setValue(' #000000 ')
      await input.trigger('blur')
      expect((input.element as HTMLInputElement).value).toBe('#000000')
    })

    it('parses hex color with alpha input', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#00ff0080',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('handles case-insensitive hex color', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ABCDEF',
        },
      })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('handles invalid color input gracefully', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: 'invalid-color',
        },
      })
      // Invalid initial value should NOT emit (stays at default or just logs error)
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('events', () => {
    it('emits active-change on hue change and commits on completion', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
        },
      })
      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      expect(wrapper.emitted('active-change')?.[0]?.[0]).toMatch(/^#[0-9a-f]{6}$/)
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      await hueComponent.vm.$emit('changeComplete')
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatch(/^#[0-9a-f]{6}$/)
    })

    it('emits update:modelValue on saturation change completion', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
        },
      })
      const saturationComponent = wrapper.findComponent({ name: 'Saturation' })
      await saturationComponent.vm.$emit('change', { s: 50, v: 50 })
      expect(wrapper.emitted('active-change')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      await saturationComponent.vm.$emit('changeComplete')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emits update:modelValue on alpha change completion', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          showAlpha: true,
        },
      })
      const alphaComponent = wrapper.findComponent({ name: 'Alpha' })
      await alphaComponent.vm.$emit('change', 0.5)
      expect(wrapper.emitted('active-change')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      await alphaComponent.vm.$emit('changeComplete')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('interaction controls', () => {
    it('does not emit when disabled', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          disabled: true,
        },
      })

      const hueComponent = wrapper.findComponent({ name: 'Hue' })
      await hueComponent.vm.$emit('change', 180)
      await hueComponent.vm.$emit('changeComplete')

      expect(wrapper.emitted('active-change')).toBeFalsy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.find('.vue3-colorful').attributes('aria-disabled')).toBe('true')
    })

    it('does not emit when readOnly', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          readOnly: true,
        },
      })

      const saturationComponent = wrapper.findComponent({ name: 'Saturation' })
      await saturationComponent.vm.$emit('change', { s: 20, v: 20 })
      await saturationComponent.vm.$emit('changeComplete')

      expect(wrapper.emitted('active-change')).toBeFalsy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.find('.vue3-colorful').attributes('aria-readonly')).toBe('true')
    })

    it('clears the value when clearable is enabled', async () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          clearable: true,
        },
      })

      await wrapper.find('.vue3-colorful__clear').trigger('click')

      expect(wrapper.emitted('active-change')?.[0]?.[0]).toBe('')
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('')
    })

    it('renders the input in read-only mode when editable is false', () => {
      const wrapper = mount(ColorPicker, {
        props: {
          modelValue: '#ff0000',
          showInput: true,
          editable: false,
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('readonly')).toBeDefined()
      expect(input.attributes('aria-readonly')).toBe('true')
    })
  })

  it('handles vertical orientation', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ffffff', vertical: true },
    })
    expect(wrapper.find('.vue3-colorful__hue--vertical').exists()).toBe(true)
  })

  it('hides alpha slider when showAlpha is false (explicit test)', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ffffff', showAlpha: false },
    })
    expect(wrapper.find('.vue3-colorful__alpha').exists()).toBe(false)
  })
})
