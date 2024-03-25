import { defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'

export default defineComponent({
  name: 'Saturation',

  props: {
    hsva() {
      return {
        h: Number,
        s: Number,
        v: Number,
      }
    }
  },

  setup(props) {
    return () => (
      <div class='vue3-colorful__saturation'>
        <Interactive>
          {(position: Interaction) => <Pointer left={position.left} top={position.top} color='green'></Pointer>}
        </Interactive>
      </div>
    )
  }
})