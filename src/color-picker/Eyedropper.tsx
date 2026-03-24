import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Eyedropper',

  emits: ['select'],

  setup(_, { emit }) {
    const isSupported = typeof window !== 'undefined' && 'EyeDropper' in window

    const openDropper = async () => {
      if (!isSupported) return

      try {
        // @ts-ignore - EyeDropper is a new API
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
        disabled={!isSupported}
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
