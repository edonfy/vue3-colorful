import { CSSProperties, PropType, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import Interactive from './Interactive'
import { Interaction } from '../composables/useInteraction'
import { HsvaColor } from '../types'
import { hsvaToHslString } from '../utils/convert'
import { clamp } from '../utils/clamp'

export default defineComponent({
  name: 'Saturation',

  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
  },

  emits: ['change'],

  setup(props, { emit, slots }) {
    const handleMove = (position: Interaction) => {
      const value = {
        s: position.left * 100,
        v: 100 - position.top * 100,
      }
      emit('change', value)
    }

    const hueColor = computed(() => hsvaToHslString({ h: props.hsva.h, s: 100, v: 100, a: 1 }))

    const containerStyle = computed<CSSProperties>(() => ({
      backgroundColor: hueColor.value,
    }))

    const handleKey = (e: KeyboardEvent) => {
      // Small step 1%, large step 10%
      const step = e.shiftKey ? 10 : 1
      const s = props.hsva.s
      const v = props.hsva.v

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

      switch (e.key) {
        case 'ArrowLeft':
          emit('change', { s: clamp(s - step, 0, 100), v })
          break
        case 'ArrowRight':
          emit('change', { s: clamp(s + step, 0, 100), v })
          break
        case 'ArrowUp':
          emit('change', { s, v: clamp(v + step, 0, 100) })
          break
        case 'ArrowDown':
          emit('change', { s, v: clamp(v - step, 0, 100) })
          break
        case 'Home':
          emit('change', { s: 0, v })
          break
        case 'End':
          emit('change', { s: 100, v })
          break
        case 'PageUp':
          emit('change', { s, v: 100 })
          break
        case 'PageDown':
          emit('change', { s, v: 0 })
          break
      }
    }

    return () => (
      <div class="vue3-colorful__saturation" style={containerStyle.value}>
        <Interactive
          onMove={handleMove}
          onKey={handleKey}
          role="slider"
          aria-label="Saturation and Value"
          aria-valuenow={Math.round(props.hsva.s)}
          aria-valuetext={`Saturation ${Math.round(props.hsva.s)}%, Value ${Math.round(props.hsva.v)}%`}
        >
          {slots.track?.()}
          {slots.pointer ? (
            slots.pointer({
              top: 1 - props.hsva.v / 100,
              left: props.hsva.s / 100,
              color: hsvaToHslString(props.hsva),
            })
          ) : (
            <Pointer
              top={1 - props.hsva.v / 100}
              left={props.hsva.s / 100}
              color={hsvaToHslString(props.hsva)}
            ></Pointer>
          )}
        </Interactive>
      </div>
    )
  },
})
