import type { Meta, StoryObj } from '@storybook/vue3'
import HexColorPicker from '../color-picker/HexColorPicker'

const meta: Meta<typeof HexColorPicker> = {
  title: 'Advanced/Theming',
  component: HexColorPicker,
  argTypes: {
    modelValue: { control: 'text' },
    dark: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof HexColorPicker>

export const DarkTheme: Story = {
  args: {
    modelValue: '#3b82f6',
    dark: true,
    showAlpha: true,
    presets: ['#ff0000', '#00ff00', '#0000ff'],
  },
}

export const CustomVariables: Story = {
  args: {
    modelValue: '#3b82f6',
  },
  render: (args) => ({
    components: { HexColorPicker },
    setup() {
      return { args }
    },
    template: `
      <div style="--vc-width: 300px; --vc-height: 300px; --vc-border-radius: 20px; --vc-accent-color: #ef4444; --vc-pointer-size: 40px;">
        <HexColorPicker v-bind="args" />
        <p style="margin-top: 20px; color: #666; font-family: sans-serif;">
          Customized via CSS Variables:<br/>
          - Width/Height: 300px<br/>
          - Border Radius: 20px<br/>
          - Accent Color: Red<br/>
          - Pointer Size: 40px
        </p>
      </div>
    `,
  }),
}

export const WithManualInput: Story = {
  args: {
    modelValue: '#3b82f6',
    showInput: true,
    colorLabel: 'Hex',
    showAlpha: true,
  },
}

export const VerticalLayout: Story = {
  args: {
    modelValue: '#3b82f6',
    vertical: true,
    showAlpha: true,
  },
  render: (args) => ({
    components: { HexColorPicker },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; gap: 20px; height: 200px;">
        <HexColorPicker v-bind="args" />
        <p style="margin: 0; color: #666; font-family: sans-serif; align-self: center;">
          Layout automatically switches to horizontal rows<br/>
          when <code>vertical=true</code> is passed.
        </p>
      </div>
    `,
  }),
}
