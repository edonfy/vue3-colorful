import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, afterEach } from 'vitest'
import BasePicker from '../src/color-picker/BasePicker'

const hsva = {
  h: 0,
  s: 100,
  v: 100,
  a: 1,
}

describe('BasePicker', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders composed sections for body, input, and presets', () => {
    const wrapper = mount(BasePicker, {
      props: {
        hsva,
        activeColor: '#ff0000',
        showInput: true,
        colorLabel: 'HEX',
        presets: ['#ff0000'],
      },
    })

    expect(wrapper.findComponent({ name: 'PickerBody' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PickerInputSection' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PickerPresetsSection' }).exists()).toBe(true)
    expect(wrapper.findAll('.vue3-colorful__preset')).toHaveLength(1)
  })

  it('renders clear actions when input is hidden and picker is clearable', async () => {
    const wrapper = mount(BasePicker, {
      props: {
        hsva,
        activeColor: '#ff0000',
        clearable: true,
      },
    })

    expect(wrapper.findComponent({ name: 'PickerActions' }).exists()).toBe(true)
    await wrapper.find('.vue3-colorful__clear').trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('forwards color input active and committed events', async () => {
    vi.useFakeTimers()

    const wrapper = mount(BasePicker, {
      props: {
        hsva,
        activeColor: '#ff0000',
        showInput: true,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('#00ff00')

    expect(wrapper.emitted('colorActiveChange')?.[0]?.[0]).toBe('#00ff00')

    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('colorSelect')?.[0]?.[0]).toBe('#00ff00')
  })

  it('forwards preset selection events', async () => {
    const wrapper = mount(BasePicker, {
      props: {
        hsva,
        activeColor: '#ff0000',
        presets: ['#00ff00'],
      },
    })

    await wrapper.find('.vue3-colorful__preset').trigger('click')

    expect(wrapper.emitted('colorSelect')?.[0]?.[0]).toBe('#00ff00')
  })

  it('does not render the presets section when no presets are configured', () => {
    const wrapper = mount(BasePicker, {
      props: {
        hsva,
        activeColor: '#ff0000',
      },
    })

    expect(wrapper.find('.vue3-colorful__presets').exists()).toBe(false)
  })
})
