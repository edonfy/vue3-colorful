import { defineComponent } from 'vue'

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
          aria-label="Clear color"
        >
          Clear
        </button>
      </div>
    )
  },
})
