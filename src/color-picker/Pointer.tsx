import { defineComponent, computed, CSSProperties } from 'vue'

export default defineComponent({
  name: 'Pointer',

  props: {
    top: { type: Number },
    left: { type: Number, required: true },
    color: { type: String, required: true },
  },

  setup(props) {
    const top = computed<number>(() => {
      return props.top !== undefined ? props.top : 0.5
    })

    const style = computed<CSSProperties>(() => ({
      top: `${top.value * 100}%`,
      left: `${props.left * 100}%`
    }))

    return () => (
      <div class="vue3-colorful__pointer" style={style.value} >
        <div class="vue3-colorful__pointer-fill" style={{ backgroundColor: props.color }} />
      </div>
    )
  },
})