import { defineComponent } from 'vue'
import { AnyColor, ColorModel } from '../types'
import ColorPickerPanel from './ColorPickerPanel'
import { commonPickerProps } from './commonPickerProps'

export const createPicker = (name: string, model: ColorModel) => {
  return defineComponent({
    name,
    props: commonPickerProps,
    emits: ['update:modelValue', 'active-change'],
    setup(props, { emit, slots }) {
      return () => (
        <ColorPickerPanel
          {...props}
          colorModel={model}
          onUpdate:modelValue={(value: AnyColor) => emit('update:modelValue', value)}
          onActive-change={(value: AnyColor) => emit('active-change', value)}
          v-slots={slots}
        />
      )
    },
  })
}
