import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { clamp } from '@/utils/clamp'

export interface Interaction {
  left: number;
  top: number;
}

// Finds the proper window object to fix iframe embedding issues
const getParentWindow = (node?: HTMLElement | null): Window => {
  return (node && node.ownerDocument.defaultView) || self
}

const getRelativePosition = (node: HTMLElement, event: PointerEvent) => {
  const rect = node.getBoundingClientRect()

  return {
    left: clamp((event.pageX - (rect.left + getParentWindow(node).scrollX)) / rect.width),
    top: clamp((event.pageY - (rect.top + getParentWindow(node).scrollY)) / rect.height),
  }
}

export interface InteractiveProps {
  onMove?: (interaction: Interaction) => void;
  onKey?: (event: KeyboardEvent) => void;
}

export default defineComponent({
  name: 'Interactive',

  props: {
    onMove: {
      type: Function as unknown as () => (interaction: Interaction) => void,
      default: undefined
    },
    onKey: {
      type: Function as unknown as () => (event: KeyboardEvent) => void,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const rootRef = ref<HTMLDivElement>()

    const interaction = reactive<Interaction>({
      left: 0,
      top: 0
    })

    let isStart = false

    const handleKeyDown = (e: KeyboardEvent) => {
      props.onKey?.(e)
    }

    const start = (e: PointerEvent) => {
      e.preventDefault()
      isStart = true

      const position = getRelativePosition(rootRef.value!, e)
      interaction.left = position.left
      interaction.top = position.top

      props.onMove?.(position)
    }

    const move = (e: PointerEvent) => {
      e.preventDefault()

      if (isStart) {
        const position = getRelativePosition(rootRef.value!, e)
        interaction.left = position.left
        interaction.top = position.top

        props.onMove?.(position)
      }
    }

    const end = () => {
      isStart = false
    }

    onMounted(() => {
      rootRef.value?.addEventListener('pointerdown', start)
      addEventListener('pointermove', move)
      addEventListener('pointerup', end)
    })

    onUnmounted(() => {
      rootRef.value?.removeEventListener('pointerdown', start)
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', end)
    })

    return () => (
      <div ref={rootRef} class={'vue3-colorful__interactive'} tabindex={0} onKeydown={handleKeyDown}>
        {slots.default ? slots.default(interaction) : null}
      </div>
    )
  }
})