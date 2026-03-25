import { onMounted, onUnmounted, reactive, Ref } from 'vue'
import { clamp } from '../utils/clamp'

export interface Interaction {
  left: number
  top: number
}

const getRelativePosition = (node: HTMLElement, event: PointerEvent | MouseEvent | TouchEvent) => {
  const rect = node.getBoundingClientRect()
  const pointer = 'touches' in event ? event.touches[0] : (event as MouseEvent)

  return {
    left: clamp((pointer.clientX - rect.left) / rect.width),
    top: clamp((pointer.clientY - rect.top) / rect.height),
  }
}

export const useInteraction = (
  rootRef: Ref<HTMLElement | undefined>,
  onMove: (interaction: Interaction) => void,
  onKey?: (event: KeyboardEvent) => void
) => {
  const interaction = reactive<Interaction>({
    left: 0,
    top: 0,
  })

  let isStart = false
  let frameId: number | null = null
  let latestPosition: Interaction | null = null

  const updatePosition = (position: Interaction) => {
    interaction.left = position.left
    interaction.top = position.top
    onMove(position)
  }

  const start = (e: PointerEvent | MouseEvent | TouchEvent) => {
    if (!rootRef.value) return
    if ('button' in e && e.button !== 0) return
    e.preventDefault()
    isStart = true

    if ('pointerId' in e) {
      try {
        rootRef.value.setPointerCapture(e.pointerId)
      } catch (err) {
        if (
          typeof process !== 'undefined' &&
          process.env &&
          process.env.NODE_ENV !== 'production'
        ) {
          console.warn('[vue3-colorful] setPointerCapture failed', err)
        }
      }
    }

    const position = getRelativePosition(rootRef.value, e)
    latestPosition = position
    updatePosition(position)
  }

  const move = (e: PointerEvent | MouseEvent | TouchEvent) => {
    if (isStart && rootRef.value) {
      e.preventDefault()
      latestPosition = getRelativePosition(rootRef.value, e)

      if (frameId === null) {
        frameId = requestAnimationFrame(() => {
          if (latestPosition) {
            updatePosition(latestPosition)
          }
          frameId = null
        })
      }
    }
  }

  const end = (e?: PointerEvent | MouseEvent | TouchEvent) => {
    isStart = false
    if (rootRef.value && e && 'pointerId' in e) {
      try {
        rootRef.value.releasePointerCapture(e.pointerId)
      } catch (err) {
        if (
          typeof process !== 'undefined' &&
          process.env &&
          process.env.NODE_ENV !== 'production'
        ) {
          console.warn('[vue3-colorful] releasePointerCapture failed', err)
        }
      }
    }
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    onKey?.(e)
  }

  onMounted(() => {
    window.addEventListener('pointermove', move as EventListener)
    window.addEventListener('pointerup', end as EventListener)
    window.addEventListener('pointercancel', end as EventListener)
  })

  onUnmounted(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }
    window.removeEventListener('pointermove', move as EventListener)
    window.removeEventListener('pointerup', end as EventListener)
    window.removeEventListener('pointercancel', end as EventListener)
  })

  return {
    interaction,
    start,
    handleKeyDown,
  }
}
