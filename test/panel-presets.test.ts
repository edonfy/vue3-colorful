import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorPickerPanel from '../src/color-picker/ColorPickerPanel'

describe('ColorPickerPanel presets', () => {
  it('does not render presets by default', () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
      },
    })

    expect(wrapper.find('.vue3-colorful__presets').exists()).toBe(false)
  })

  it('renders flat preset swatches with labels', () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        presets: ['#ffffff', { label: 'Primary', value: '#3b82f6' }],
      },
    })

    expect(wrapper.findAll('.vue3-colorful__preset')).toHaveLength(2)
    expect(wrapper.find('[title="Primary"]').exists()).toBe(true)
    expect(wrapper.findAll('.vue3-colorful__preset--active')).toHaveLength(1)
  })

  it('commits preset selections', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#000000',
        presets: ['#ffffff'],
      },
    })

    await wrapper.find('.vue3-colorful__preset').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('#ffffff')
  })
})
