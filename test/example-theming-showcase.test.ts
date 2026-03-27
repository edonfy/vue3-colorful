import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/index', () => ({
  HexColorPicker: defineComponent({
    name: 'HexColorPicker',
    setup(_, { slots }) {
      return () => h('div', { class: 'hex-picker-stub' }, slots.default?.())
    },
  }),
}))

import ThemingShowcase from '../example/components/ThemingShowcase'

describe('ThemingShowcase', () => {
  it('renders a self-contained custom slot code sample', () => {
    const wrapper = mount(ThemingShowcase)
    const codeBlocks = wrapper.findAll('.code-block__code')

    expect(codeBlocks).toHaveLength(2)

    const slotCode = codeBlocks[1].text()

    expect(slotCode).toContain('const saturationPointerStyle = {')
    expect(slotCode).toContain("position: 'absolute'")
    expect(slotCode).toContain("borderRadius: '9999px'")
    expect(slotCode).toContain('const huePointerStyle = {')
  })
})
