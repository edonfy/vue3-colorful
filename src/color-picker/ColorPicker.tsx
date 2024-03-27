import { defineComponent, ref, watch } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'
import { HsvaColor } from '@/types'
import { hsvaToHex, hsvaToRgbString, hsvaToRgbaString } from '@/utils/covert'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    colorModel: {
      type: String,
      default: 'hex'
    },
    showAlpha: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const hsva = ref<HsvaColor>({ h: 0, s: 100, v: 100, a: 1 })

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
      let value = ''

      const { colorModel, showAlpha } = props

      if (colorModel === 'rgb') {
        value = showAlpha ? hsvaToRgbaString(hsva.value) : hsvaToRgbString(hsva.value)
      } else {
        value = hsvaToHex(hsva.value)
      }

      emit('update:modelValue', value)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.modelValue, () => {
      // TODO
    }, {
      immediate: true
    })


    return () => {
      return (
        <div class={'vue3-colorful'}>
          <Saturation hsva={hsva.value} onChange={saturationChange}></Saturation>
          <Hue hue={hsva.value.h} onChange={hueChange}></Hue>
          {props.showAlpha && <Alpha hsva={hsva.value} onChange={alphaChange}></Alpha>}
        </div>
      )
    }
  }
})