import { computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslString } from '@/utils/convert'
import { clamp } from '@/utils/clamp'

export default defineComponent({
  name: 'Hue',

  props: {
    hue: {
      type: Number,
      required: true,
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const handleMove = (position: Interaction) => {
      const h = 360 * position.left
      emit('change', h)
    }

    const handleKey = (e: KeyboardEvent) => {
      // 360 / 100 = 3.6 per step
      const step = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        emit('change', clamp((props.hue - step) / 360) * 360)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        emit('change', clamp((props.hue + step) / 360) * 360)
      }
    }

    const color = computed<string>(() => {
      return hsvaToHslString({ h: props.hue, s: 100, v: 100, a: 1 })
    })

    return () => (
      <div class={'vue3-colorful__hue'}>
        <Interactive
          on-move={handleMove}
          on-key={handleKey}
          role="slider"
          aria-label="Hue"
          aria-valuenow={Math.round(props.hue)}
          aria-valuemin="0"
          aria-valuemax="360"
        >
          <Pointer left={props.hue / 360} color={color.value}></Pointer>
        </Interactive>
      </div>
    )
  },
})
