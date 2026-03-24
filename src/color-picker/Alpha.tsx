import { PropType, CSSProperties, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslaString } from '@/utils/convert'
import { clamp } from '@/utils/clamp'


export default defineComponent({
  name: 'Alpha',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true
    }
  },

  emits: ['change'],

  setup(props, { emit }) {
    const handleMove = (position: Interaction) => {
      emit('change', position.left)
    }

    const gradientColors = computed(() => {

      const { h, s, v } = props.hsva
      const colorFrom = hsvaToHslaString({ h, s, v, a: 0 })
      const colorTo = hsvaToHslaString({ h, s, v, a: 1 })
      return { colorFrom, colorTo }
    })

    const gradientStyle = computed<CSSProperties>(() => {
      const { colorFrom, colorTo } = gradientColors.value
      return {
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
      }
    })

    const pointerColor = computed(() => hsvaToHslaString(props.hsva))

    const handleKey = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 0.1 : 0.01
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        emit('change', clamp(props.hsva.a - step))
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        emit('change', clamp(props.hsva.a + step))
      }
    }

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        <Interactive
          on-move={handleMove}
          on-key={handleKey}
          role="slider"
          aria-label="Alpha"
          aria-valuenow={Math.round(props.hsva.a * 100)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext={`${Math.round(props.hsva.a * 100)}%`}
        >
          <Pointer class={'vue3-colorful__alpha-pointer'} left={props.hsva.a} color={pointerColor.value}></Pointer>
        </Interactive>
      </div>
    )

  }
})