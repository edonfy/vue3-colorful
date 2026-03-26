import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Presets from '../src/color-picker/Presets'

describe('Presets', () => {
  it('renders grouped presets with labels and recent colors', () => {
    const wrapper = mount(Presets, {
      props: {
        recentColors: ['#000000'],
        presets: [
          '#ffffff',
          {
            label: 'Brand',
            colors: [{ value: '#3b82f6', label: 'Primary' }],
          },
        ],
        activeColor: '#3b82f6',
      },
    })

    expect(wrapper.text()).toContain('Recent')
    expect(wrapper.text()).toContain('Brand')
    expect(wrapper.findAll('.vue3-colorful__preset')).toHaveLength(3)
    expect(wrapper.find('[title="Primary"]').exists()).toBe(true)
    expect(wrapper.findAll('.vue3-colorful__preset--active')).toHaveLength(1)
  })

  it('emits selected preset values', async () => {
    const wrapper = mount(Presets, {
      props: {
        presets: [{ label: 'Brand', colors: ['#3b82f6'] }],
        activeColor: '',
      },
    })

    await wrapper.find('.vue3-colorful__preset').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('#3b82f6')
  })
})
