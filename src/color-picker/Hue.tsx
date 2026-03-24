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
    vertical: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const handleMove = (position: Interaction) => {
      const h = 360 * (props.vertical ? position.top : position.left)
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
      <div class={['vue3-colorful__hue', { 'vue3-colorful__hue--vertical': props.vertical }]}>
        <Interactive
          onMove={handleMove}
          onKey={handleKey}
          role="slider"
          ariaLabel="Hue"
          aria-valuenow={Math.round(props.hue)}
          aria-valuemin="0"
          aria-valuemax="360"
        >
          <Pointer
            left={props.vertical ? 0.5 : props.hue / 360}
            top={props.vertical ? props.hue / 360 : 0.5}
            color={color.value}
          ></Pointer>
        </Interactive>
      </div>
    )
  },
})
