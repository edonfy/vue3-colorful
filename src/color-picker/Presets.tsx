import { defineComponent, PropType, computed } from 'vue'
import { isBlankColor, normalizeColorForComparison, normalizeColorString } from '@/utils/converter'

export default defineComponent({
  name: 'Presets',

  props: {
    presets: {
      type: Array as PropType<string[]>,
      required: true,
    },
    activeColor: {
      type: String,
      default: '',
    },
  },

  emits: ['select'],

  setup(props, { emit }) {
    const getNormalizedColor = (color: string, context: 'preset' | 'active'): string => {
      if (isBlankColor(color)) {
        return ''
      }

      try {
        return normalizeColorForComparison(color)
      } catch {
        console.warn(`[vue3-colorful] Invalid ${context} color: ${color}`)
        return normalizeColorString(color)
      }
    }

    const normalizedPresets = computed(() => {
      return props.presets.map((color) => {
        return {
          original: color,
          normalized: getNormalizedColor(color, 'preset'),
        }
      })
    })

    const activeNormalized = computed(() => {
      return getNormalizedColor(props.activeColor, 'active')
    })

    return () => (
      <div class="vue3-colorful__presets">
        {normalizedPresets.value.map((item, index) => (
          <button
            key={`${item.normalized}-${index}`}
            type="button"
            class={[
              'vue3-colorful__preset',
              item.normalized === activeNormalized.value && 'vue3-colorful__preset--active',
            ]}
            style={{ backgroundColor: item.original }}
            onClick={() => emit('select', item.original)}
            aria-label={`Select color ${item.original}`}
          />
        ))}
      </div>
    )
  },
})
