import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import ColorPicker from '@/color-picker'

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    colorModel: {
      control: 'select',
      options: ['hex', 'rgb', 'hsv', 'hsl', 'cmyk'],
    },
    showAlpha: {
      control: 'boolean',
    },
    showEyedropper: {
      control: 'boolean',
    },
    presets: {
      control: 'object',
    },
  },
  render: (args) => {
    return {
      setup() {
        return () => h(ColorPicker, { ...args })
      },
    }
  },
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  args: {
    modelValue: '#ff6600',
  },
}

export const FullFeatured: Story = {
  args: {
    modelValue: '#3b82f6',
    showAlpha: true,
    showEyedropper: true,
    presets: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'],
  },
}

export const RGBA: Story = {
  args: {
    modelValue: 'rgba(255, 102, 0, 0.5)',
    colorModel: 'rgb',
    showAlpha: true,
  },
}

export const HSL: Story = {
  args: {
    modelValue: 'hsl(24, 100%, 50%)',
    colorModel: 'hsl',
  },
}

export const CMYK: Story = {
  args: {
    modelValue: 'cmyk(0%, 60%, 100%, 0%)',
    colorModel: 'cmyk',
  },
}
