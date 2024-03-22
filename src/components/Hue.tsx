import { defineComponent } from 'vue'
import Pointer from './Pointer'

export default defineComponent({
  name: 'Hue',

  props: {
    hue: Number,
  },


  setup(props) {
    return () => (
      <div class={'vue3-colorful__hue'}>
        <Pointer left={0.1} color='blue'></Pointer>
      </div>
    )
  }
})