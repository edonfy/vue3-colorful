import { computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslString } from '@/utils/covert'

export default defineComponent({
  name: 'Hue',

  props: {
    hue: {
      type: Number,
      required: true
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const handleMove = (position: Interaction) => {
      const h = 360 * position.left
      emit('change', h)
    }

    const color = computed<string>(() => {
      return hsvaToHslString({ h: props.hue, s: 100, v: 100, a: 1 })
    })

    return () => (
      <div class={'vue3-colorful__hue'}>
        <Interactive on-move={handleMove}>
          <Pointer left={props.hue / 360} color={color.value}></Pointer>
        </Interactive>
      </div >
    )
  }
})