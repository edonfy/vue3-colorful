import { defineComponent } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    colorModel: String
  },

  setup() {

    return () => (
      <div class={'vue3-colorful'}>
        <Saturation></Saturation>
        <Hue></Hue>
        <Alpha></Alpha>
      </div>
    )
  }
})