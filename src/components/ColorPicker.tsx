import { defineComponent, ref } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import { HsvaColor } from '@/types'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: '#ffffff'
    },
    colorModel: {
      type: String,
      default: 'rbg'
    },
    showAlpha: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup() {
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 0 })
    const hsvaChange = (color: any) => {
      // hsva.value = color
    }

    const hueChange = (h: number) => {
      hsva.value.h = h
    }

    const alphaChange = (a: number) => {
      console.log(a)
      hsva.value.a = a
    }


    return () => {
      return (
        <div class={'vue3-colorful'}>
          <Saturation></Saturation>
          <Hue hue={hsva.value.h} onChange={hueChange}></Hue>
          <Alpha hsva={hsva.value} onChange={alphaChange}></Alpha>
        </div>
      )
    }
  }
})