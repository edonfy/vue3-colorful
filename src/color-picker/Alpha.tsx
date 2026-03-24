import { PropType, CSSProperties, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslaString, hsvaToRgbaString } from '@/utils/convert'
import { clamp } from '@/utils/clamp'

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

  setup(props, { emit }) {
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
      const step = e.shiftKey ? 0.1 : 0.01
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        emit('change', clamp(props.hsva.a - step))
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        emit('change', clamp(props.hsva.a + step))
      }
    }

    return () => (
      <div class={['vue3-colorful__alpha', { 'vue3-colorful__alpha--vertical': props.vertical }]}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        <Interactive
          onMove={handleMove}
          onKey={handleKey}
          role="slider"
          ariaLabel="Alpha"
          aria-valuenow={Math.round(props.hsva.a * 100)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext={`${Math.round(props.hsva.a * 100)}%`}
        >
          <Pointer
            class={'vue3-colorful__alpha-pointer'}
            left={props.vertical ? 0.5 : props.hsva.a}
            top={props.vertical ? props.hsva.a : 0.5}
            color={pointerColor.value}
          ></Pointer>
        </Interactive>
      </div>
    )
  },
})
