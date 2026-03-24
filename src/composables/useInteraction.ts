import { onMounted, onUnmounted, reactive, Ref } from 'vue'
import { clamp } from '../utils/clamp'

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

  const start = (e: MouseEvent | TouchEvent) => {
    if (!rootRef.value) return
    e.preventDefault()
    isStart = true

    const position = getRelativePosition(rootRef.value, e)
    latestPosition = position
    updatePosition(position)
  }

  const move = (e: MouseEvent | TouchEvent) => {
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

  const end = () => {
    isStart = false
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    onKey?.(e)
  }

  onMounted(() => {
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
  })

  onUnmounted(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
  })

  return {
    interaction,
    start,
    handleKeyDown,
  }
}
