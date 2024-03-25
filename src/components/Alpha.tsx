import { PropType, StyleValue, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction, clamp } from './Interactive'
import { hsvaToHslString, hsvaToHslaString } from '@/utils/covert'

export default defineComponent({
  name: 'Alpha',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true
    }
  },

  emits: ['change'],

  setup(props, { emit }) {
    const gradientStyle = computed<StyleValue>(() => {
      const colorFrom = hsvaToHslaString(Object.assign({}, props.hsva, { a: 0 }))
      const colorTo = hsvaToHslaString(Object.assign({}, props.hsva, { a: 1 }))

      console.log(props.hsva, colorFrom, colorTo)

      return {
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
      }
    })

    const handleMove = (position: Interaction) => {
      emit('change', clamp(position.left))
    }

    const left = computed<number>(() => props.hsva.a)

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        <Interactive on-move={handleMove}>
          <Pointer left={left.value} color={hsvaToHslString(props.hsva)}></Pointer>
        </Interactive>
      </div>
    )
  }
})