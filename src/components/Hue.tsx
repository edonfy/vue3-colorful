import { defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'

export default defineComponent({
  name: 'Hue',

  props: {
    hue: Number,
  },

  setup(props) {
    return () => (
      <div class={'vue3-colorful__hue'}>
        <Interactive>
          {(position: Interaction) => <Pointer left={position.left} color='green'></Pointer>}
        </Interactive>
      </div>
    )
  }
})