import { defineComponent, ref, watch } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import { HsvaColor } from '@/types'
import { hslaStringToHsva, hsvaToHslaString } from '@/utils/covert'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    colorModel: {
      type: String,
      default: 'hsl'
    },
    showAlpha: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 0 })

    const hueChange = (h: number) => {
      hsva.value.h = h
    }

    const alphaChange = (a: number) => {
      hsva.value.a = a
    }

    const saturationChange = ({ s, v }: { s: number, v: number }) => {
      hsva.value.s = s
      hsva.value.v = v
    }

    watch(hsva, () => {
      emit('update:modelValue', hsvaToHslaString(hsva.value))
    }, {
      deep: true
    })

    watch(() => props.modelValue, () => {
      hsva.value = hslaStringToHsva(props.modelValue)
    }, {
      immediate: true
    })


    return () => {
      return (
        <div class={'vue3-colorful'}>
          <Saturation hsva={hsva.value} onChange={saturationChange}></Saturation>
          <Hue class={{ 'vue3-colorful__bottom-round': props.showAlpha }} hue={hsva.value.h} onChange={hueChange}></Hue>
          <Alpha class={{ 'vue3-colorful__bottom-round': !props.showAlpha }} hsva={hsva.value} onChange={alphaChange}></Alpha>
        </div>
      )
    }
  }
})