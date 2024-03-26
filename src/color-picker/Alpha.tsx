import { PropType, CSSProperties, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslaString } from '@/utils/covert'

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
    const gradientStyle = computed<CSSProperties>(() => {
      const colorFrom = hsvaToHslaString(Object.assign({}, props.hsva, { a: 0 }))
      const colorTo = hsvaToHslaString(Object.assign({}, props.hsva, { a: 1 }))

      return {
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
      }
    })

    const handleMove = (position: Interaction) => {
      emit('change', position.left)
    }

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        <Interactive on-move={handleMove}>
          <Pointer class={'vue3-colorful__alpha-pointer'} left={props.hsva.a} color={hsvaToHslaString(props.hsva)}></Pointer>
        </Interactive>
      </div>
    )
  }
})