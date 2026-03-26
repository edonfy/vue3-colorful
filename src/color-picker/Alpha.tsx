import { PropType, CSSProperties, computed, defineComponent } from 'vue'
import { HsvaColor } from '../types'
import { Interaction } from '../composables/useInteraction'
import { hsvaToRgbaString } from '../utils/convert'
import { clamp } from '../utils/clamp'
import Pointer from './Pointer'
import Interactive from './Interactive'

export default defineComponent({
  name: 'Alpha',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
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
      emit('change', props.vertical ? position.top : position.left)
    }

    const gradientStyle = computed<CSSProperties>(() => {
      const { h, s, v } = props.hsva
      const colorFrom = hsvaToRgbaString({ h, s, v, a: 0 })
      const colorTo = hsvaToRgbaString({ h, s, v, a: 1 })
      return {
        backgroundImage: `linear-gradient(${props.vertical ? '180deg' : '90deg'}, ${colorFrom}, ${colorTo})`,
      }
    })

    const pointerColor = computed(() => hsvaToRgbaString(props.hsva))

    const handleKey = (e: KeyboardEvent) => {
      // 10% step for Shift or Page keys
      const isLargeStep = e.shiftKey || e.key === 'PageUp' || e.key === 'PageDown'
      const step = isLargeStep ? 0.1 : 0.01

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
        emit('change', clamp(props.hsva.a - step))
      } else if (isUp) {
        emit('change', clamp(props.hsva.a + step))
      } else if (e.key === 'Home') {
        emit('change', 0)
      } else if (e.key === 'End') {
        emit('change', 1)
      }
    }

    return () => (
      <div class={['vue3-colorful__alpha', { 'vue3-colorful__alpha--vertical': props.vertical }]}>
        {!slots.track && (
          <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        )}
        <Interactive
          onMove={handleMove}
          onKey={handleKey}
          role="slider"
          aria-label="Alpha"
          aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
          aria-valuenow={Math.round(props.hsva.a * 100)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext={`${Math.round(props.hsva.a * 100)}%`}
        >
          {slots.track?.()}
          {slots.pointer ? (
            slots.pointer({
              left: props.vertical ? 0.5 : props.hsva.a,
              top: props.vertical ? props.hsva.a : 0.5,
              color: pointerColor.value,
            })
          ) : (
            <Pointer
              class={'vue3-colorful__alpha-pointer'}
              left={props.vertical ? 0.5 : props.hsva.a}
              top={props.vertical ? props.hsva.a : 0.5}
              color={pointerColor.value}
            ></Pointer>
          )}
        </Interactive>
      </div>
    )
  },
})
