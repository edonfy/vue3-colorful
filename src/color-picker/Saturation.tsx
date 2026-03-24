import { CSSProperties, PropType, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive, { Interaction } from './Interactive'
import { HsvaColor } from '@/types'
import { hsvaToHslString } from '@/utils/convert'
import { clamp } from '@/utils/clamp'

export default defineComponent({
  name: 'Saturation',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const handleMove = (position: Interaction) => {
      const value = {
        s: position.left * 100,
        v: 100 - position.top * 100,
      }
      emit('change', value)
    }

    const containerStyle = computed<CSSProperties>(() => ({
      backgroundColor: hsvaToHslString({ h: props.hsva.h, s: 100, v: 100, a: 1 }),
    }))

    const handleKey = (e: KeyboardEvent) => {
      // Small step 1%, large step 10%
      const step = e.shiftKey ? 10 : 1
      const s = props.hsva.s
      const v = props.hsva.v

      switch (e.key) {
        case 'ArrowLeft':
          emit('change', { s: clamp(s - step), v })
          break
        case 'ArrowRight':
          emit('change', { s: clamp(s + step), v })
          break
        case 'ArrowUp':
          emit('change', { s, v: clamp(v + step) })
          break
        case 'ArrowDown':
          emit('change', { s, v: clamp(v - step) })
          break
      }
    }

    return () => (
      <div class="vue3-colorful__saturation" style={containerStyle.value}>
        <Interactive
          on-move={handleMove}
          on-key={handleKey}
          role="slider"
          aria-label="Saturation and Value"
          aria-valuetext={`Saturation ${Math.round(props.hsva.s)}%, Value ${Math.round(props.hsva.v)}%`}
        >
          <Pointer
            top={1 - props.hsva.v / 100}
            left={props.hsva.s / 100}
            color={hsvaToHslString(props.hsva)}
          ></Pointer>
        </Interactive>
      </div>
    )
  },
})
