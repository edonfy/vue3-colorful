import { defineComponent } from 'vue'

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
  },

  emits: ['select'],

  setup(props, { emit }) {
    const isSupported = typeof window !== 'undefined' && 'EyeDropper' in window

    const openDropper = async () => {
      if (props.disabled || props.readOnly) return
      if (!isSupported) return

      try {
        // @ts-expect-error - EyeDropper is a new API
        const dropper = new window.EyeDropper()
        const result = await dropper.open()
        emit('select', result.sRGBHex)
      } catch {
        // User canceled or error
      }
    }

    return () => (
      <button
        type="button"
        class="vue3-colorful__eyedropper"
        onClick={openDropper}
        disabled={!isSupported || props.disabled || props.readOnly}
        aria-disabled={!isSupported || props.disabled || props.readOnly ? 'true' : undefined}
        aria-label="Pick color from screen"
        title={isSupported ? 'Pick color from screen' : 'EyeDropper not supported in this browser'}
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
