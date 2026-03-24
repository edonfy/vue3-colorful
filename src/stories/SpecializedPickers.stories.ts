import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import {
  HexColorPicker,
  RgbColorPicker,
  HslColorPicker,
  HsvColorPicker,
  CmykColorPicker,
} from '../index'

const meta: Meta = {
  title: 'Components/SpecializedPickers',
  tags: ['autodocs'],
}

export default meta

export const Hex: StoryObj = {
  render: (args) => ({
    setup() {
      const modelValue = '#3b82f6'
      return () => h(HexColorPicker, { ...args, modelValue })
    },
  }),
}

export const RGB: StoryObj = {
  render: (args) => ({
    setup() {
      const modelValue = 'rgb(59, 130, 246)'
      return () => h(RgbColorPicker, { ...args, modelValue })
    },
  }),
}

export const HSL: StoryObj = {
  render: (args) => ({
    setup() {
      const modelValue = 'hsl(217, 91%, 60%)'
      return () => h(HslColorPicker, { ...args, modelValue })
    },
  }),
}

export const HSV: StoryObj = {
  render: (args) => ({
    setup() {
      const modelValue = 'hsv(217, 76%, 96%)'
      return () => h(HsvColorPicker, { ...args, modelValue })
    },
  }),
}

export const CMYK: StoryObj = {
  render: (args) => ({
    setup() {
      const modelValue = 'cmyk(76%, 47%, 0%, 4%)'
      return () => h(CmykColorPicker, { ...args, modelValue })
    },
  }),
}
