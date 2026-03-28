import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorPickerPanel from '../src/color-picker/ColorPickerPanel'

const getRecentTitles = (wrapper: ReturnType<typeof mount>) =>
  wrapper
    .findAll('.vue3-colorful__recent .vue3-colorful__preset')
    .map((item) => item.attributes('title'))

describe('ColorPickerPanel recent colors', () => {
  it('stays hidden by default and when enabled without committed colors', () => {
    const defaultWrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
      },
    })

    expect(defaultWrapper.find('.vue3-colorful__recent').exists()).toBe(false)

    const enabledWrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        showRecent: true,
      },
    })

    expect(enabledWrapper.find('.vue3-colorful__recent').exists()).toBe(false)
  })

  it('records only committed values when showRecent is enabled', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        showRecent: true,
        showInput: true,
      },
    })

    const input = wrapper.find('input')

    await input.setValue('#00ff00')

    expect(wrapper.emitted('active-change')?.[0]?.[0]).toBe('#00ff00')
    expect(wrapper.find('.vue3-colorful__recent').exists()).toBe(false)

    await input.trigger('blur')

    expect(getRecentTitles(wrapper)).toEqual(['#00ff00'])
  })

  it('deduplicates recent colors and applies the configured cap', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#111111',
        showRecent: true,
        showInput: true,
        maxRecentColors: 2,
      },
    })

    const input = wrapper.find('input')

    for (const color of ['#ff0000', '#00ff00', '#0000ff', '#00ff00']) {
      await input.setValue(color)
      await input.trigger('blur')
    }

    expect(getRecentTitles(wrapper)).toEqual(['#00ff00', '#0000ff'])
  })

  it('does not add blank clears to recent history', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#111111',
        showRecent: true,
        showInput: true,
        clearable: true,
      },
    })

    const input = wrapper.find('input')

    await input.setValue('#ff0000')
    await input.trigger('blur')
    await wrapper.find('.vue3-colorful__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
    expect(getRecentTitles(wrapper)).toEqual(['#ff0000'])
  })

  it('does not record a recent color when a change completes without a new commit', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#3b82f6',
        showRecent: true,
      },
    })

    await wrapper.findComponent({ name: 'Hue' }).vm.$emit('changeComplete')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.vue3-colorful__recent').exists()).toBe(false)
  })

  it('does not commit the draft input before selecting a recent swatch', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#111111',
        showRecent: true,
        showInput: true,
      },
    })

    const input = wrapper.find('input')

    await input.setValue('#ff0000')
    await input.trigger('blur')

    const recent = wrapper.find('.vue3-colorful__recent .vue3-colorful__preset')

    await input.trigger('focus')
    await input.setValue('#123456')
    await recent.trigger('pointerdown')
    input.element.dispatchEvent(new FocusEvent('blur', { relatedTarget: recent.element }))
    await wrapper.vm.$nextTick()
    await recent.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['#ff0000']])
    expect((input.element as HTMLInputElement).value).toBe('#ff0000')
    expect(getRecentTitles(wrapper)).toEqual(['#ff0000'])
  })
})
