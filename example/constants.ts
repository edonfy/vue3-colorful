import type { ColorModel } from '@/types'

export const GITHUB_REPO_URL = 'https://github.com/edonfy/vue3-colorful'

export const COLOR_MODELS: { value: ColorModel; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsv', label: 'HSV' },
  { value: 'hwb', label: 'HWB' },
  { value: 'cmyk', label: 'CMYK' },
]

export const GROUPED_PRESETS = [
  {
    label: 'Brand',
    colors: [
      { label: 'Primary', value: '#6366f1' },
      { label: 'Accent', value: '#ec4899' },
    ],
  },
  {
    label: 'System',
    colors: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
  },
]

export interface ComponentDemo {
  id: string
  title: string
  group: 'specialized' | 'panel' | 'input'
  defaultColor: string
  codeSnippet: string
}

export const COMPONENT_DEMOS: ComponentDemo[] = [
  {
    id: 'hex',
    title: 'Hex Picker',
    group: 'specialized',
    defaultColor: '#3b82f6',
    codeSnippet: `<HexColorPicker v-model={color.value} />`,
  },
  {
    id: 'rgb',
    title: 'RGB Picker',
    group: 'specialized',
    defaultColor: 'rgba(16, 185, 129, 0.8)',
    codeSnippet: `<RgbColorPicker v-model={color.value} showAlpha />`,
  },
  {
    id: 'hsl',
    title: 'HSL Picker',
    group: 'specialized',
    defaultColor: 'hsl(346, 84%, 61%)',
    codeSnippet: `<HslColorPicker v-model={color.value} />`,
  },
  {
    id: 'hsv',
    title: 'HSV Picker',
    group: 'specialized',
    defaultColor: 'hsv(38, 93%, 96%)',
    codeSnippet: `<HsvColorPicker v-model={color.value} />`,
  },
  {
    id: 'hwb',
    title: 'HWB Picker',
    group: 'specialized',
    defaultColor: 'hwb(38 0% 4%)',
    codeSnippet: `<HwbColorPicker v-model={color.value} />`,
  },
  {
    id: 'cmyk',
    title: 'CMYK Picker',
    group: 'specialized',
    defaultColor: 'cmyk(0%, 50%, 100%, 0%)',
    codeSnippet: `<CmykColorPicker v-model={color.value} />`,
  },
  {
    id: 'popover',
    title: 'Popover',
    group: 'panel',
    defaultColor: '#8b5cf6',
    codeSnippet: `<ColorPickerPopover v-model={color.value} showInput />`,
  },
  {
    id: 'panel',
    title: 'Panel (Clearable)',
    group: 'panel',
    defaultColor: '#3b82f6',
    codeSnippet: `<ColorPickerPanel v-model={color.value} showInput clearable />`,
  },
  {
    id: 'input',
    title: 'Hex Input',
    group: 'input',
    defaultColor: '#3b82f6',
    codeSnippet: `<HexColorInput v-model={color.value} clearable />`,
  },
]

export const GROUP_LABELS: Record<string, string> = {
  specialized: 'Specialized Pickers',
  panel: 'Popover & Panel',
  input: 'Form Input',
}

export const GROUP_ORDER: Array<'specialized' | 'panel' | 'input'> = [
  'specialized',
  'panel',
  'input',
]
