import { ref, computed, watch, Ref } from 'vue'

export type TransitionStatus = 'unmounted' | 'initial' | 'open' | 'close'

export interface UseTransitionStatusReturn {
  status: Ref<TransitionStatus>
  isMounted: Ref<boolean>
  onTransitionEnd: () => void
}

export function useTransitionStatus(isOpen: Ref<boolean>): UseTransitionStatusReturn {
  const status = ref<TransitionStatus>('unmounted')

  const isMounted = computed(() => status.value !== 'unmounted')

  watch(isOpen, (open) => {
    if (open) {
      status.value = 'initial'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isOpen.value) {
            status.value = 'open'
          }
        })
      })
    } else {
      status.value = 'close'
    }
  })

  const onTransitionEnd = () => {
    if (status.value === 'close') {
      status.value = 'unmounted'
    }
  }

  return { status, isMounted, onTransitionEnd }
}
