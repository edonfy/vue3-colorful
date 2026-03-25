import { defineComponent, PropType, computed } from 'vue'
import { parseColor, formatColor } from '../utils/converter'

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
    const normalizedPresets = computed(() => {
      return props.presets.map((color) => {
        try {
          return {
            original: color,
            normalized: formatColor(parseColor(color), 'hex', false),
          }
        } catch {
          return {
            original: color,
            normalized: color.toLowerCase(),
          }
        }
      })
    })

    const activeNormalized = computed(() => {
      try {
        return formatColor(parseColor(props.activeColor), 'hex', false)
      } catch {
        return props.activeColor.toLowerCase()
      }
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
