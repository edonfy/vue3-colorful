import { defineComponent, ref } from 'vue'
import {
  HexColorPicker,
  HexColorInput,
  RgbColorPicker,
  HslColorPicker,
  HsvColorPicker,
  HwbColorPicker,
  CmykColorPicker,
  ColorPickerPanel,
} from '@/index'
import { ColorPickerPopover } from '@/popover'
import { COMPONENT_DEMOS, GROUP_ORDER, GROUP_LABELS } from '../constants'
import ComponentCard from './ComponentCard'

export default defineComponent({
  name: 'ComponentShowcase',
  setup() {
    const hexColor = ref('#3b82f6')
    const hexInputColor = ref('#3b82f6')
    const rgbColor = ref('rgba(16, 185, 129, 0.8)')
    const hslColor = ref('hsl(346, 84%, 61%)')
    const hsvColor = ref('hsv(38, 93%, 96%)')
    const hwbColor = ref('hwb(38 0% 4%)')
    const cmykColor = ref('cmyk(0%, 50%, 100%, 0%)')
    const popoverColor = ref('#8b5cf6')
    const panelColor = ref('#3b82f6')

    const renderPickerContent = (id: string) => {
      switch (id) {
        case 'hex':
          return <HexColorPicker v-model={hexColor.value} style={{ width: '100%' }} />
        case 'rgb':
          return <RgbColorPicker v-model={rgbColor.value} showAlpha style={{ width: '100%' }} />
        case 'hex-input':
          return <HexColorInput v-model={hexInputColor.value} clearable />
        case 'hsl':
          return <HslColorPicker v-model={hslColor.value} style={{ width: '100%' }} />
        case 'hsv':
          return <HsvColorPicker v-model={hsvColor.value} style={{ width: '100%' }} />
        case 'hwb':
          return <HwbColorPicker v-model={hwbColor.value} style={{ width: '100%' }} />
        case 'cmyk':
          return <CmykColorPicker v-model={cmykColor.value} style={{ width: '100%' }} />
        case 'popover':
          return <ColorPickerPopover v-model={popoverColor.value} showInput />
        case 'panel':
          return (
            <ColorPickerPanel
              v-model={panelColor.value}
              showInput
              clearable
              style={{ width: '100%' }}
            />
          )
        default:
          return null
      }
    }

    return () => (
      <section id="components" class="showcase">
        <h2 class="section-title">Components</h2>
        <p class="section-description">
          Each component is tree-shakable and independently usable. Click Demo to see it in action,
          or Code to get the snippet.
        </p>

        {GROUP_ORDER.map((group) => {
          const demos = COMPONENT_DEMOS.filter((d) => d.group === group)
          return (
            <div key={group} class="showcase__group">
              <h3 class="showcase__group-title">{GROUP_LABELS[group]}</h3>
              <div class="showcase__grid">
                {demos.map((demo) => (
                  <ComponentCard key={demo.id} title={demo.title} codeSnippet={demo.codeSnippet}>
                    {renderPickerContent(demo.id)}
                  </ComponentCard>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    )
  },
})
