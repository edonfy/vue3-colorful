import { CSSProperties, PropType, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'
import { HsvaColor } from '@/types'
import { hsvaToHslString } from '@/utils/covert'

export default defineComponent({
  name: 'Saturation',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true
    }
  },

  emits: ['change'],

  setup(props, { emit }) {

    const handleMove = (position: Interaction) => {
      const value = {
        h: props.hsva.h,
        a: props.hsva.a,
        s: position.left * 100,
        v: 100 - position.top * 100,
      }
      emit('change', value)
    }

    const containerStyle = computed<CSSProperties>(() => ({
      backgroundColor: hsvaToHslString({ h: props.hsva.h, s: 100, v: 100, a: 1 })
    }))

    return () => (
      <div class='vue3-colorful__saturation' style={containerStyle.value}>
        <Interactive on-move={handleMove}>
          <Pointer
            top={1 - props.hsva.v / 100}
            left={props.hsva.s / 100}
            color={hsvaToHslString(props.hsva)}
          ></Pointer>
        </Interactive>
      </div>
    )
  }
})