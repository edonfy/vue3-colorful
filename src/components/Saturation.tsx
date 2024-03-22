import { defineComponent } from 'vue'

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

  setup(props, { slots }) {
    return () => (
      <div class='vue3-colorful__saturation'>
        {slots.default ? slots.default() : null}
      </div>
    )
  }
})