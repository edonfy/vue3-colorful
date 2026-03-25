import { defineComponent, CSSProperties, computed } from 'vue'

export default defineComponent({
  name: 'Pointer',

  props: {
    top: { type: Number, default: 0.5 },
    left: { type: Number, default: 0.5 },
    color: { type: String, required: true },
  },

  setup(props) {
    const style = computed<CSSProperties>(() => ({
      top: `${props.top * 100}%`,
      left: `${props.left * 100}%`,
    }))

    return () => (
      <div class="vue3-colorful__pointer" style={style.value}>
        <div class="vue3-colorful__pointer-fill" style={{ backgroundColor: props.color }} />
      </div>
    )
  },
})
