import { defineComponent } from 'vue'
import Saturation from './Saturation'
import Hue from './Hue'
import Alpha from './Alpha'

export default defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: '#ffffff'
    },
    colorModel: {
      type: String,
      default: 'rbg'
    },
    showAlpha: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup() {
    return () => (
      <div class={'vue3-colorful'}>
        <Saturation></Saturation>
        <Hue></Hue>
        <Alpha hsva={{ h: 0, s: 0, v: 0, a: 0 }}></Alpha>
      </div>
    )
  }
})