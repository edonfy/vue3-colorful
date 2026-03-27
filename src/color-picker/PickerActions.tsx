import { defineComponent, PropType } from 'vue'
import { ColorPickerLabels } from '../types'
import { getColorPickerLabel } from './labels'

export default defineComponent({
  name: 'PickerActions',

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

  emits: ['clear'],

  setup(props, { emit }) {
    return () => (
      <div class="vue3-colorful__actions">
        <button
          type="button"
          class="vue3-colorful__clear"
          onClick={() => emit('clear')}
          disabled={props.disabled || props.readOnly}
          aria-label={getColorPickerLabel(props.labels, 'clearColor')}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <path d="M4 4l8 8" stroke-linecap="round" />
            <path d="M12 4l-8 8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    )
  },
})
