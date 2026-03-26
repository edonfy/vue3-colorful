import { defineComponent, ref, PropType } from 'vue'
import { useInteraction } from '../composables/useInteraction'

export default defineComponent({
  name: 'Interactive',

  props: {
    onKey: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      default: undefined,
    },
    role: {
      type: String,
      default: undefined,
    },
  },

  emits: ['move'],

  setup(props, { slots, emit, attrs }) {
    const rootRef = ref<HTMLDivElement>()

    const { interaction, start, handleKeyDown } = useInteraction(rootRef, {
      onMove: (position) => emit('move', position),
      onKey: (event) => props.onKey?.(event),
    })

    return () => (
      <div
        {...attrs}
        ref={rootRef}
        class={['vue3-colorful__interactive', attrs.class]}
        role={props.role}
        tabindex={0}
        onKeydown={handleKeyDown}
        onPointerdown={start}
      >
        {slots.default ? slots.default(interaction) : null}
      </div>
    )
  },
})
