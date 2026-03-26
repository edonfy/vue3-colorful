import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HexColorInput from '../src/color-picker/HexColorInput'

describe('HexColorInput', () => {
  it('normalizes pasted hex values without a leading hash', async () => {
    const wrapper = mount(HexColorInput, {
      props: { modelValue: '#ff0000' },
    })

    const input = wrapper.find('input')
    await input.setValue('00ff00')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('#00ff00')
  })

  it('rejects non-hex values', async () => {
    const wrapper = mount(HexColorInput, {
      props: { modelValue: '#ff0000' },
    })

    const input = wrapper.find('input')
    await input.setValue('rgb(0, 255, 0)')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBe('true')
  })
})
