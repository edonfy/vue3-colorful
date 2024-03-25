import { PropType, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction } from './Interactive'

export default defineComponent({
  name: 'Alpha',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true
    }
  },

  setup() {
    const gradientStyle = {
      'background-image': 'linear-gradient(90deg, rgba(85, 116, 155, 0), rgb(85, 116, 155))'
    }

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle}></div>
        <Interactive>
          {(position: Interaction) => <Pointer left={position.left} color='green'></Pointer>}
        </Interactive>
      </div>
    )
  }
})