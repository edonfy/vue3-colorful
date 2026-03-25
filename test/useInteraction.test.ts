import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h, PropType } from 'vue'
import { mount } from '@vue/test-utils'
import { useInteraction } from '../src/composables/useInteraction'

describe('useInteraction composable', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) =>
      setTimeout(() => fn(Date.now()), 16)
    )
    vi.stubGlobal('cancelAnimationFrame', (id: number | undefined) => clearTimeout(id))
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  const TestComponent = defineComponent({
    props: {
      onMove: {
        type: Function as PropType<(i: { left: number; top: number }) => void>,
        default: undefined,
      },
      onKey: {
        type: Function as PropType<(e: KeyboardEvent) => void>,
        default: undefined,
      },
    },
    setup(props) {
      const rootRef = ref<HTMLElement>()
      const { interaction, start, handleKeyDown } = useInteraction(rootRef, {
        onMove: props.onMove!,
        onKey: props.onKey,
      })
      return { rootRef, interaction, start, handleKeyDown }
    },
    render() {
      // Correct way to bind a template ref in a render function
      return h('div', { ref: 'rootRef', class: 'root' })
    },
  })

  it('initializes with zero values', () => {
    const onMove = vi.fn()
    const wrapper = mount(TestComponent, { props: { onMove } })
    const vm = wrapper.vm as { interaction: { left: number; top: number } }
    expect(vm.interaction.left).toBe(0)
    expect(vm.interaction.top).toBe(0)
  })

  it('updates position on start (mousedown)', async () => {
    const onMove = vi.fn()
    const wrapper = mount(TestComponent, { props: { onMove } })
    const vm = wrapper.vm as {
      rootRef: HTMLElement
      interaction: { left: number; top: number }
      start: (e: MouseEvent) => void
    }

    // Mock rect
    vm.rootRef.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
        }) as DOMRect
    )

    const event = new MouseEvent('mousedown', { clientX: 50, clientY: 50, bubbles: true })
    vm.start(event)

    expect(onMove).toHaveBeenCalledWith({ left: 0.5, top: 0.5 })
  })

  it('handles pointermove after start', async () => {
    const onMove = vi.fn()
    const wrapper = mount(TestComponent, { props: { onMove } })
    const vm = wrapper.vm as { rootRef: HTMLElement; start: (e: MouseEvent) => void }

    vm.rootRef.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
        }) as DOMRect
    )

    vm.start(new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true }))
    onMove.mockClear()

    const moveEvent = new PointerEvent('pointermove', { clientX: 90, clientY: 90, bubbles: true })
    window.dispatchEvent(moveEvent)

    vi.runAllTimers()
    expect(onMove).toHaveBeenCalledWith({ left: 0.9, top: 0.9 })
  })

  it('stops updating after pointerup', async () => {
    const onMove = vi.fn()
    const wrapper = mount(TestComponent, { props: { onMove } })
    const vm = wrapper.vm as { rootRef: HTMLElement; start: (e: MouseEvent) => void }

    vm.rootRef.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          bottom: 100,
          right: 100,
        }) as DOMRect
    )

    vm.start(new MouseEvent('mousedown', { clientX: 10, clientY: 10 }))
    window.dispatchEvent(new PointerEvent('pointerup'))
    onMove.mockClear()

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 90, clientY: 90 }))
    vi.runAllTimers()
    expect(onMove).not.toHaveBeenCalled()
  })
})
