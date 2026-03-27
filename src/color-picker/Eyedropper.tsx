import { defineComponent, PropType } from 'vue'
import { ColorPickerLabels } from '../types'
import { getColorPickerLabel } from './labels'

interface EyeDropperResult {
  sRGBHex: string
}

interface EyeDropperInstance {
  open: () => Promise<EyeDropperResult>
}

interface EyeDropperWindow extends Window {
  EyeDropper?: new () => EyeDropperInstance
}

export default defineComponent({
  name: 'Eyedropper',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: Object as PropType<Partial<ColorPickerLabels>>,
      default: () => ({}),
    },
  },

  emits: ['select'],

  setup(props, { emit }) {
    const getEyeDropper = (): (new () => EyeDropperInstance) | undefined => {
      if (typeof window === 'undefined') {
        return undefined
      }

      return (window as EyeDropperWindow).EyeDropper
    }

    const isSupported = (): boolean => getEyeDropper() !== undefined

    const openDropper = async () => {
      if (props.disabled || props.readOnly) return
      const EyeDropper = getEyeDropper()
      if (!EyeDropper) return

      try {
        const dropper = new EyeDropper()
        const result = await dropper.open()
        emit('select', result.sRGBHex)
      } catch {
        return
      }
    }

    return () => (
      <button
        type="button"
        class="vue3-colorful__eyedropper"
        onClick={openDropper}
        disabled={!isSupported() || props.disabled || props.readOnly}
        aria-disabled={!isSupported() || props.disabled || props.readOnly ? 'true' : undefined}
        aria-label={getColorPickerLabel(props.labels, 'pickColorFromScreen')}
        title={
          isSupported()
            ? getColorPickerLabel(props.labels, 'pickColorFromScreen')
            : getColorPickerLabel(props.labels, 'eyedropperUnsupported')
        }
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 22l5-5" />
          <path d="M9.5 14.5l5 5L22 12l-7.5-7.5-7.5 7.5z" />
          <path d="M12 7l3 3" />
        </svg>
      </button>
    )
  },
})
