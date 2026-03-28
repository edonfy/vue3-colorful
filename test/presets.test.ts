import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Presets from '../src/color-picker/Presets'

describe('Presets', () => {
  it('renders flat presets with labels', () => {
    const wrapper = mount(Presets, {
      props: {
        presets: ['#ffffff', { value: '#3b82f6', label: 'Primary' }],
        activeColor: '#3b82f6',
      },
    })

    expect(wrapper.findAll('.vue3-colorful__preset')).toHaveLength(2)
    expect(wrapper.find('[title="Primary"]').exists()).toBe(true)
    expect(wrapper.findAll('.vue3-colorful__preset--active')).toHaveLength(1)
  })

  it('renders the active preset indicator as an svg icon', () => {
    const wrapper = mount(Presets, {
      props: {
        presets: ['#ffffff', '#3b82f6'],
        activeColor: '#3b82f6',
      },
    })

    const indicator = wrapper.find(
      '.vue3-colorful__preset--active .vue3-colorful__preset-indicator'
    )

    expect(indicator.exists()).toBe(true)
    expect(indicator.find('svg').exists()).toBe(true)
  })

  it('emits selected preset values', async () => {
    const wrapper = mount(Presets, {
      props: {
        presets: [{ label: 'Brand', value: '#3b82f6' }],
        activeColor: '',
      },
    })

    await wrapper.find('.vue3-colorful__preset').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('#3b82f6')
  })
})
