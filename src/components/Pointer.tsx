import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pointer',

  props: {
    top: { type: Number },
    left: { type: Number, required: true },
    color: { type: String, required: true },
  },

  setup(props) {
    const { top = 0.5, left, color } = props

    const style = {
      top: `${top * 100}%`,
      left: `${left * 100}%`
    }

    return () => (
      <div class="vue3-colorful__pointer" style={style} >
        <div class="vue3-colorful__pointer-fill" style={{ backgroundColor: color }} />
      </div>
    )
  },
})