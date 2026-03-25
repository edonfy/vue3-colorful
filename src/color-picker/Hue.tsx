import { computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive from './Interactive'
import { Interaction } from '@/composables/useInteraction'
import { hsvaToHslString } from '@/utils/convert'

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

  setup(props, { emit, slots }) {
    const handleMove = (position: Interaction) => {
      const h = 360 * (props.vertical ? position.top : position.left)
      emit('change', h)
    }

    const handleKey = (e: KeyboardEvent) => {
      // 10% step for Shift or Page keys
      const isLargeStep = e.shiftKey || e.key === 'PageUp' || e.key === 'PageDown'
      const step = isLargeStep ? 36 : 1

      if (
        [
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
        ].includes(e.key)
      ) {
        e.preventDefault()
      }

      const isDown =
        e.key === 'ArrowLeft' ||
        (props.vertical ? e.key === 'ArrowUp' : e.key === 'ArrowDown') ||
        e.key === 'PageDown'
      const isUp =
        e.key === 'ArrowRight' ||
        (props.vertical ? e.key === 'ArrowDown' : e.key === 'ArrowUp') ||
        e.key === 'PageUp'

      if (isDown) {
        emit('change', (((props.hue - step) % 360) + 360) % 360)
      } else if (isUp) {
        emit('change', (props.hue + step) % 360)
      } else if (e.key === 'Home') {
        emit('change', 0)
      } else if (e.key === 'End') {
        // Emit 360 for clearer semantic end-of-range (visual result is same as 0)
        emit('change', 360)
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
          aria-label="Hue"
          aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
          aria-valuenow={Math.round(props.hue)}
          aria-valuemin="0"
          aria-valuemax="359"
        >
          {slots.track?.()}
          {slots.pointer ? (
            slots.pointer({
              left: props.vertical ? 0.5 : props.hue / 360,
              top: props.vertical ? props.hue / 360 : 0.5,
              color: color.value,
            })
          ) : (
            <Pointer
              left={props.vertical ? 0.5 : props.hue / 360}
              top={props.vertical ? props.hue / 360 : 0.5}
              color={color.value}
            ></Pointer>
          )}
        </Interactive>
      </div>
    )
  },
})
