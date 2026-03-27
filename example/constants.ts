import type { ColorModel, PresetCollectionItem } from '@/types'

export const GITHUB_REPO_URL = 'https://github.com/edonfy/vue3-colorful'

export const COLOR_MODELS: { value: ColorModel; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsv', label: 'HSV' },
  { value: 'hwb', label: 'HWB' },
  { value: 'cmyk', label: 'CMYK' },
]

export const PRESET_SWATCHES: PresetCollectionItem[] = [
  { label: 'Primary', value: '#6366f1' },
  { label: 'Accent', value: '#ec4899' },
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
]

export interface ComponentDemo {
  id: string
  title: string
  group: 'specialized' | 'panel'
  codeSnippet: string
}

export const COMPONENT_DEMOS: ComponentDemo[] = [
  {
    id: 'hex',
    title: 'Hex Picker',
    group: 'specialized',
    codeSnippet: `<HexColorPicker v-model={color.value} />`,
  },
  {
    id: 'rgb',
    title: 'RGB Picker',
    group: 'specialized',
    codeSnippet: `<RgbColorPicker v-model={color.value} showAlpha />`,
  },
  {
    id: 'hsl',
    title: 'HSL Picker',
    group: 'specialized',
    codeSnippet: `<HslColorPicker v-model={color.value} />`,
  },
  {
    id: 'hsv',
    title: 'HSV Picker',
    group: 'specialized',
    codeSnippet: `<HsvColorPicker v-model={color.value} />`,
  },
  {
    id: 'hwb',
    title: 'HWB Picker',
    group: 'specialized',
    codeSnippet: `<HwbColorPicker v-model={color.value} />`,
  },
  {
    id: 'cmyk',
    title: 'CMYK Picker',
    group: 'specialized',
    codeSnippet: `<CmykColorPicker v-model={color.value} />`,
  },
  {
    id: 'popover',
    title: 'Popover',
    group: 'panel',
    codeSnippet: `<ColorPickerPopover v-model={color.value} showInput />`,
  },
  {
    id: 'panel',
    title: 'Panel (Clearable)',
    group: 'panel',
    codeSnippet: `<ColorPickerPanel v-model={color.value} showInput clearable />`,
  },
]

export const GROUP_LABELS: Record<'specialized' | 'panel', string> = {
  specialized: 'Specialized Pickers',
  panel: 'Popover & Panel',
}

export const GROUP_ORDER: Array<'specialized' | 'panel'> = ['specialized', 'panel']
