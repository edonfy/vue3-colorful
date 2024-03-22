import { defineComponent } from 'vue'
import Pointer from './Pointer'

export default defineComponent({
  name: 'Alpha',

  props: {
    hsva() {
      return {
        h: Number,
        s: Number,
        v: Number,
      }
    }
  },

  setup() {
    const gradientStyle = {
      'background-image': 'linear-gradient(90deg, rgba(85, 116, 155, 0), rgb(85, 116, 155))'
    }

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle}></div>
        <Pointer left={0.2} color='green'></Pointer>
      </div>
    )
  }
})