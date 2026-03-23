import { PropType, CSSProperties, computed, defineComponent } from 'vue'
import Pointer from './Pointer'
import { HsvaColor } from '@/types'
import Interactive, { Interaction } from './Interactive'
import { hsvaToHslaString } from '@/utils/convert'

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

    const handleMove = (position: Interaction) => {
      emit('change', position.left)
    }

    return () => (
      <div class={'vue3-colorful__alpha'}>
        <div class={'vue3-colorful__alpha-gradient'} style={gradientStyle.value}></div>
        <Interactive on-move={handleMove}>
          <Pointer class={'vue3-colorful__alpha-pointer'} left={props.hsva.a} color={pointerColor.value}></Pointer>
        </Interactive>
      </div>
    )
  }
})