import { defineComponent, PropType, computed } from 'vue'
import { PresetCollectionItem, PresetGroup, PresetSwatch } from '../types'
import { isBlankColor, normalizeColorForComparison, normalizeColorString } from '../utils/converter'

interface NormalizedPresetItem {
  original: string
  normalized: string
  label?: string
}

interface NormalizedPresetGroup {
  label?: string
  items: NormalizedPresetItem[]
}

export default defineComponent({
  name: 'Presets',

  props: {
    presets: {
      type: Array as PropType<PresetCollectionItem[]>,
      required: true,
    },
    recentColors: {
      type: Array as PropType<string[]>,
      default: () => [],
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
  },

  emits: ['select'],

  setup(props, { emit }) {
    const toPresetItem = (
      item: string | PresetSwatch,
      context: 'preset' | 'active'
    ): NormalizedPresetItem => {
      const original = typeof item === 'string' ? item : item.value

      return {
        original,
        normalized: getNormalizedColor(original, context),
        label: typeof item === 'string' ? undefined : item.label,
      }
    }

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

    const normalizedPresets = computed<NormalizedPresetGroup[]>(() => {
      const defaultItems: NormalizedPresetItem[] = []
      const groups: NormalizedPresetGroup[] = []

      if (props.recentColors.length > 0) {
        groups.push({
          label: 'Recent',
          items: props.recentColors.map((color) => toPresetItem(color, 'preset')),
        })
      }

      props.presets.forEach((entry) => {
        if (typeof entry === 'string' || ('value' in entry && typeof entry.value === 'string')) {
          defaultItems.push(toPresetItem(entry as string | PresetSwatch, 'preset'))
          return
        }

        const group = entry as PresetGroup
        groups.push({
          label: group.label,
          items: group.colors.map((color) => toPresetItem(color, 'preset')),
        })
      })

      if (defaultItems.length > 0) {
        groups.unshift({ items: defaultItems })
      }

      return groups.filter((group) => group.items.length > 0)
    })

    const activeNormalized = computed(() => {
      return getNormalizedColor(props.activeColor, 'active')
    })

    return () => (
      <div class="vue3-colorful__presets">
        {normalizedPresets.value.map((group, groupIndex) => (
          <div
            key={`preset-group-${group.label || groupIndex}`}
            class="vue3-colorful__preset-group"
          >
            {group.label && <div class="vue3-colorful__preset-group-label">{group.label}</div>}
            <div class="vue3-colorful__preset-grid">
              {group.items.map((item, index) => (
                <button
                  key={`${item.normalized}-${groupIndex}-${index}`}
                  type="button"
                  class={[
                    'vue3-colorful__preset',
                    item.normalized === activeNormalized.value && 'vue3-colorful__preset--active',
                  ]}
                  style={{ backgroundColor: item.original }}
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
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
})
