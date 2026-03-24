import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Hue from '../src/color-picker/Hue'

describe('Hue component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Hue, {
      props: {
        hue: 180,
      },
    })
    expect(wrapper.find('.vue3-colorful__hue').exists()).toBe(true)
  })

  it('renders vertically', () => {
    const wrapper = mount(Hue, {
      props: {
        hue: 180,
        vertical: true,
      },
    })
    expect(wrapper.find('.vue3-colorful__hue--vertical').exists()).toBe(true)
  })
})
