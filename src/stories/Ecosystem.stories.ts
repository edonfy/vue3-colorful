import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { HexColorPicker, ColorPickerPopover } from '../index'

const meta: Meta<typeof HexColorPicker> = {
  title: 'Ecosystem/Integrations',
  component: HexColorPicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HexColorPicker>

export const PopoverMode: Story = {
  render: () => ({
    components: { ColorPickerPopover },
    setup() {
      const color = ref('#3b82f6')
      return { color }
    },
    template: `
      <div style="padding: 50px; text-align: center;">
        <p style="margin-bottom: 20px;">Click the swatch to open the picker:</p>
        <ColorPickerPopover v-model="color" show-input />
        <p style="margin-top: 20px;">Active Color: {{ color }}</p>
      </div>
    `,
  }),
}

export const TailwindThemed: Story = {
  args: {
    modelValue: '#3b82f6',
    showInput: true,
    colorLabel: 'Tailwind',
  },
  render: (args) => ({
    components: { HexColorPicker },
    setup() {
      return { args }
    },
    template: `
      <div class="tailwind-simulation" style="
        --vc-width: 320px;
        --vc-accent-color: #ef4444;
        --vc-border-radius: 16px;
      ">
        <p style="margin-bottom: 8px; font-size: 14px; color: #666;">
          Simulation of <b>Tailwind/UnoCSS</b> theme injection:
        </p>
        <HexColorPicker v-bind="args" />
        <div style="margin-top: 12px; font-size: 12px; font-family: monospace; background: #f4f4f4; padding: 8px; border-radius: 4px;">
          // Resulting CSS Variables:<br/>
          --vc-width: 320px;<br/>
          --vc-accent-color: #ef4444;<br/>
          --vc-border-radius: 16px;
        </div>
      </div>
    `,
  }),
}

export const NuxtAutoImport: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; border: 1px dashed #ccc; border-radius: 8px;">
        <h3>Nuxt 3 Auto-import Simulation</h3>
        <p>In a Nuxt 3 project, you can simply use the component without imports:</p>
        <pre style="background: #222; color: #fff; padding: 10px; border-radius: 4px;">
&lt;template&gt;
  &lt;HexColorPicker v-model="color" /&gt;
&lt;/template&gt;
        </pre>
      </div>
    `,
  }),
}

export const LayeringTest: Story = {
  render: () => ({
    components: { ColorPickerPopover },
    setup() {
      const color = ref('#3b82f6')
      return { color }
    },
    template: `
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 10px;">Layering & Clipping Test</h3>
        <p style="font-size: 14px; margin-bottom: 20px;">
          The red box has <b>overflow: hidden</b>. The blue box has <b>z-index: 20</b>.
          The popover should break out of the red box and stay on top of the blue box.
        </p>

        <div style="
          width: 200px;
          height: 100px;
          overflow: hidden;
          border: 2px solid #ef4444;
          background: #fff;
          position: relative;
          z-index: 10;
          padding: 10px;
        ">
          <ColorPickerPopover v-model="color" />
          <p style="font-size: 11px; color: #999; margin-top: 5px;">Overflow: hidden container</p>
        </div>
        
        <div style="
          width: 300px;
          height: 60px;
          background: #3b82f6;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 20;
          margin-top: -40px;
          margin-left: 80px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
          I am z-index: 20
        </div>
      </div>
    `,
  }),
}
