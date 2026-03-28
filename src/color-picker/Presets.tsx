import { defineComponent, PropType, computed } from 'vue'
import { PresetCollectionItem, PresetSwatch } from '../types'
import { isBlankColor, normalizeColorForComparison, normalizeColorString } from '../utils/converter'

interface NormalizedPresetItem {
  original: string
  normalized: string
  label?: string
}

export default defineComponent({
  name: 'Presets',

  props: {
    presets: {
      type: Array as PropType<PresetCollectionItem[]>,
      required: true,
    },
    activeColor: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    sectionClass: {
      type: String,
      default: 'vue3-colorful__presets',
    },
    sectionLabel: {
      type: String,
      default: undefined,
    },
  },

  emits: ['select', 'selectStart'],

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

    const toPresetItem = (item: PresetCollectionItem): NormalizedPresetItem | null => {
      if (typeof item === 'string') {
        return {
          original: item,
          normalized: getNormalizedColor(item, 'preset'),
        }
      }

      if (typeof item.value !== 'string') {
        console.warn('[vue3-colorful] Invalid preset item: missing value')
        return null
      }

      return {
        original: item.value,
        normalized: getNormalizedColor(item.value, 'preset'),
        label: item.label,
      }
    }

    const normalizedPresets = computed<NormalizedPresetItem[]>(() =>
      props.presets
        .map((entry) => toPresetItem(entry as string | PresetSwatch))
        .filter((item): item is NormalizedPresetItem => item !== null)
    )

    const activeNormalized = computed(() => {
      return getNormalizedColor(props.activeColor, 'active')
    })

    return () => (
      <div class={props.sectionClass} aria-label={props.sectionLabel}>
        <div class="vue3-colorful__preset-grid">
          {normalizedPresets.value.map((item, index) => (
            <button
              key={`${item.normalized}-${index}`}
              type="button"
              class={[
                'vue3-colorful__preset',
                item.normalized === activeNormalized.value && 'vue3-colorful__preset--active',
              ]}
              style={{ backgroundColor: item.original }}
              onPointerdown={() => emit('selectStart')}
              onClick={() => emit('select', item.original)}
              aria-label={
                item.label ? `${item.label} ${item.original}` : `Select color ${item.original}`
              }
              aria-disabled={props.disabled || props.readOnly ? 'true' : undefined}
              disabled={props.disabled || props.readOnly}
              title={item.label || item.original}
            >
              {item.normalized === activeNormalized.value && (
                <span class="vue3-colorful__preset-indicator" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.4 11.15L3.75 8.5L2.8 9.45L6.4 13.05L13.2 6.25L12.25 5.3L6.4 11.15Z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  },
})
