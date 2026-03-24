import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { clamp } from '@/utils/clamp'

export interface Interaction {
  left: number
  top: number
}

const getRelativePosition = (node: HTMLElement, event: MouseEvent | TouchEvent) => {
  const rect = node.getBoundingClientRect()
  const pointer = 'touches' in event ? event.touches[0] : (event as MouseEvent)

  return {
    left: clamp((pointer.clientX - rect.left) / rect.width),
    top: clamp((pointer.clientY - rect.top) / rect.height),
  }
}

export default defineComponent({
  name: 'Interactive',

  inheritAttrs: true,

  props: {
    onKey: {
      type: Function as unknown as () => (event: KeyboardEvent) => void,
      default: undefined,
    },
    // a11y props
    role: String,
    ariaLabel: String,

    'aria-valuenow': [Number, String],
    'aria-valuemin': [Number, String],
    'aria-valuemax': [Number, String],
    'aria-valuetext': String,
  },

  emits: ['move'],

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLDivElement>()

    const interaction = reactive<Interaction>({
      left: 0,
      top: 0,
    })

    let isStart = false

    const handleKeyDown = (e: KeyboardEvent) => {
      props.onKey?.(e)
    }

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      isStart = true

      const position = getRelativePosition(rootRef.value!, e)
      interaction.left = position.left
      interaction.top = position.top

      emit('move', position)
    }

    const move = (e: MouseEvent | TouchEvent) => {
      if (isStart) {
        e.preventDefault()
        const position = getRelativePosition(rootRef.value!, e)
        interaction.left = position.left
        interaction.top = position.top

        emit('move', position)
      }
    }

    const end = () => {
      isStart = false
    }

    onMounted(() => {
      addEventListener('pointermove', move)
      addEventListener('mousemove', move)
      addEventListener('touchmove', move)
      addEventListener('pointerup', end)
      addEventListener('mouseup', end)
      addEventListener('touchend', end)
    })

    onUnmounted(() => {
      removeEventListener('pointermove', move)
      removeEventListener('mousemove', move)
      removeEventListener('touchmove', move)
      removeEventListener('pointerup', end)
      removeEventListener('mouseup', end)
      removeEventListener('touchend', end)
    })

    return () => (
      <div
        ref={rootRef}
        class={'vue3-colorful__interactive'}
        tabindex={0}
        onKeydown={handleKeyDown}
        onMousedown={start}
        onTouchstart={start}
        onPointerdown={start}
        role={props.role}
        aria-label={props.ariaLabel}
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
