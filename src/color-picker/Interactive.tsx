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
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['move', 'moveEnd'],

  setup(props, { slots, emit, attrs }) {
    const rootRef = ref<HTMLDivElement>()

    const { interaction, start, handleKeyDown } = useInteraction(rootRef, {
      onMove: (position) => emit('move', position),
      onMoveEnd: () => emit('moveEnd'),
      onKey: (event) => props.onKey?.(event),
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (props.disabled || props.readOnly) {
        return
      }
      start(event)
    }

    const handleInteractiveKeyDown = (event: KeyboardEvent) => {
      if (props.disabled || props.readOnly) {
        return
      }
      handleKeyDown(event)
    }

    return () => (
      <div
        {...attrs}
        ref={rootRef}
        class={[
          'vue3-colorful__interactive',
          attrs.class,
          props.disabled && 'vue3-colorful__interactive--disabled',
          props.readOnly && 'vue3-colorful__interactive--readonly',
        ]}
        role={props.role}
        tabindex={props.disabled ? -1 : 0}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-readonly={props.readOnly ? 'true' : undefined}
        onKeydown={handleInteractiveKeyDown}
        onPointerdown={handlePointerDown}
      >
        {slots.default ? slots.default(interaction) : null}
      </div>
    )
  },
})
