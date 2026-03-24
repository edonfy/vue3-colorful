import { defineComponent, ref, PropType } from 'vue'
import { useInteraction } from '../composables/useInteraction'

export default defineComponent({
  name: 'Interactive',

  props: {
    onKey: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      default: undefined,
    },
    // a11y props
    role: String,
    ariaLabel: String,

    ariaOrientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: undefined,
    },
    'aria-valuenow': [Number, String],
    'aria-valuemin': [Number, String],
    'aria-valuemax': [Number, String],
    'aria-valuetext': String,
  },

  emits: ['move'],

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLDivElement>()

    const { interaction, start, handleKeyDown } = useInteraction(
      rootRef,
      (position) => emit('move', position),
      (event) => props.onKey?.(event)
    )

    return () => (
      <div
        ref={rootRef}
        class={'vue3-colorful__interactive'}
        tabindex={0}
        onKeydown={handleKeyDown}
        onPointerdown={start}
        role={props.role}
        aria-label={props.ariaLabel}
        aria-orientation={props.ariaOrientation}
        aria-valuenow={props['aria-valuenow']}
        aria-valuemin={props['aria-valuemin']}
        aria-valuemax={props['aria-valuemax']}
        aria-valuetext={props['aria-valuetext']}
      >
        {slots.default ? slots.default(interaction) : null}
      </div>
    )
  },
})
