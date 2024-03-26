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

export default defineComponent({
  name: 'Interactive',

  props: {
    onMove: Function,
    onKey: Function
  },

  setup(props, { slots }) {
    const rootRef = ref<HTMLDivElement>()

    const interation = reactive<Interaction>({
      left: 0,
      top: 0
    })

    let isStart = false

    const start = (e: PointerEvent) => {
      isStart = true

      const position = getRelativePosition(rootRef.value!, e)
      interation.left = position.left
      interation.top = position.top

      props.onMove?.(position)
    }

    const move = (e: PointerEvent) => {
      e.preventDefault()

      if (isStart) {
        const position = getRelativePosition(rootRef.value!, e)
        interation.left = position.left
        interation.top = position.top

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
      <div ref={rootRef} class={'vue3-colorful__interactive'}>
        {slots.default ? slots.default(interation) : null}
      </div>
    )
  }
})