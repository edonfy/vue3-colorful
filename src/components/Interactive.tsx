import { defineComponent, onMounted, ref } from 'vue'

export interface Interaction {
  left: number;
  top: number;
}

export default defineComponent({
  name: 'Interactive',

  props: {
    onMove: Function,
    onKey: Function
  },

  setup(props, { slots }) {
    const rootRef = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      console.log(rootRef)

      let isStart = false

      const start = () => {
        isStart = true
        console.log('start')
      }

      const move = (e: PointerEvent) => {
        if (isStart)
          console.log('move', e, e.clientX, e.clientY)
      }

      const end = () => {
        isStart = false
        console.log('end')
      }

      rootRef.value?.addEventListener('pointerdown', start, { capture: true })
      rootRef.value?.addEventListener('pointermove', move, { capture: true })
      rootRef.value?.addEventListener('pointerup', end, { capture: true })


    })


    return () => (
      <div ref={rootRef}>
        {slots.default ? slots.default() : null}
      </div>
    )
  }
})