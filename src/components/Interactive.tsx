import { defineComponent, onMounted, reactive, ref } from 'vue'

export interface Interaction {
  left: number;
  top: number;
}

// Finds the proper window object to fix iframe embedding issues
const getParentWindow = (node?: HTMLElement | null): Window => {
  return (node && node.ownerDocument.defaultView) || self
}

export const clamp = (number: number, min = 0, max = 1): number => {
  return number > max ? max : number < min ? min : number
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

    onMounted(() => {
      let isStart = false

      const start = (e: PointerEvent) => {
        isStart = true
        const position = getRelativePosition(rootRef.value!, e)
        console.log('start', e.pageY, position)


        interation.left = position.left
        interation.top = position.top
      }

      const move = (e: PointerEvent) => {
        e.preventDefault()

        // console.log(e.clientX, isStart)

        if (isStart) {
          const position = getRelativePosition(rootRef.value!, e)
          interation.left = position.left
          interation.top = position.top
        }

      }

      const end = () => {
        isStart = false
        console.log('end')
      }

      rootRef.value!.addEventListener('pointerdown', start)
      addEventListener('pointermove', move)
      addEventListener('pointerup', end)


    })


    return () => (
      <div ref={rootRef} class={'vue3-colorful__interactive'}>
        {slots.default ? slots.default(interation) : null}
      </div>
    )
  }
})