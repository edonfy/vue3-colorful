import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ColorInput from '../src/color-picker/ColorInput'

describe('ColorInput', () => {
  describe('rendering', () => {
    it('renders input with correct role', () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })
      expect(wrapper.find('input[role="textbox"]').exists()).toBe(true)
    })

    it('displays label text', () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000', label: 'HEX' },
      })
      expect(wrapper.find('.vue3-colorful__label-text').text()).toBe('HEX')
    })

    it('sets input value from modelValue', () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })
      expect(wrapper.find('input').element.value).toBe('#ff0000')
    })
  })

  describe('input handling', () => {
    it('emits active-change on valid color input before commit', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('#00ff00')

      expect(wrapper.emitted('active-change')?.[0]?.[0]).toBe('#00ff00')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits update:modelValue on valid color input after debounce', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('#00ff00')

      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toBe('#00ff00')

      vi.useRealTimers()
    })

    it('shows invalid state for malformed color', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('not-a-color')

      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.vue3-colorful__input--invalid').exists()).toBe(true)
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')

      vi.useRealTimers()
    })

    it('does not emit for empty value', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('')

      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      vi.useRealTimers()
    })

    it('deduplicates same value', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('#ff0000')

      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      vi.useRealTimers()
    })

    it('commits an empty value when clearable is enabled', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000', clearable: true },
      })

      const input = wrapper.find('input')
      await input.setValue('')
      await input.trigger('blur')

      expect(wrapper.emitted('active-change')?.[0]?.[0]).toBe('')
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('')
      expect(wrapper.emitted('clear')).toBeTruthy()
    })

    it('does not emit changes when readOnly', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000', readOnly: true },
      })

      const input = wrapper.find('input')
      await input.setValue('#00ff00')
      await input.trigger('blur')

      expect(wrapper.emitted('active-change')).toBeUndefined()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(input.attributes('readonly')).toBeDefined()
    })

    it('does not emit changes when editable is false', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000', editable: false },
      })

      const input = wrapper.find('input')
      await input.setValue('#00ff00')
      await input.trigger('blur')

      expect(wrapper.emitted('active-change')).toBeUndefined()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(input.attributes('readonly')).toBeDefined()
    })
  })

  describe('blur handling', () => {
    it('trims whitespace on blur', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('  #00ff00  ')
      await input.trigger('blur')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toBe('#00ff00')
    })

    it('emits on blur even without prior debounce', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('#00ff00')
      await input.trigger('blur')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toBe('#00ff00')
    })

    it('does not emit an invalid value when blurred before debounce completes', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('not-a-color')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')

      vi.useRealTimers()
    })

    it('restores the last valid value when cleared and blurred', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.find('input').element.value).toBe('#ff0000')
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('false')
    })

    it('clears via the clear button', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000', clearable: true },
      })

      await wrapper.find('.vue3-colorful__clear').trigger('click')

      expect(wrapper.find('input').element.value).toBe('')
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('')
      expect(wrapper.emitted('clear')).toBeTruthy()
    })
  })

  describe('external modelValue sync', () => {
    it('updates internal value when modelValue changes externally', async () => {
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      await wrapper.setProps({ modelValue: '#00ff00' })
      expect(wrapper.find('input').element.value).toBe('#00ff00')
    })

    it('clears invalid state on external modelValue change', async () => {
      vi.useFakeTimers()
      const wrapper = mount(ColorInput, {
        props: { modelValue: '#ff0000' },
      })

      const input = wrapper.find('input')
      await input.setValue('invalid')
      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.vue3-colorful__input--invalid').exists()).toBe(true)

      await wrapper.setProps({ modelValue: '#00ff00' })
      expect(wrapper.find('.vue3-colorful__input--invalid').exists()).toBe(false)

      vi.useRealTimers()
    })
  })
})
