import {
  defineComponent,
  ref,
  PropType,
  onMounted,
  onUnmounted,
  Teleport,
  computed,
  watch,
  CSSProperties,
} from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { commonPickerProps } from './PickerFactory'
import ColorPicker from './ColorPicker'
import { ColorModel } from '../types'

export default defineComponent({
  name: 'ColorPickerPopover',
  props: {
    ...commonPickerProps,
    colorModel: {
      type: String as PropType<ColorModel>,
      default: 'hex',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const isOpen = ref(false)
    const reference = ref<HTMLElement | null>(null)
    const floating = ref<HTMLElement | null>(null)

    const { x, y, floatingStyles, isPositioned } = useFloating(reference, floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
    })

    const toggle = () => (isOpen.value = !isOpen.value)
    const close = () => {
      isOpen.value = false
      isVisible.value = false
    }

    // Check if coordinates have settled away from (0,0)
    const isPositionedCorrectly = computed(() => {
      return isPositioned.value && x.value !== null && y.value !== null
    })

    // Delayed visibility guard (2 frames)
    const isVisible = ref(false)
    watch([isOpen, isPositionedCorrectly], ([open, positioned]) => {
      if (open && positioned) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (isOpen.value) {
              isVisible.value = true
            }
          })
        })
      } else if (!open) {
        isVisible.value = false
      }
    })

    // Secure styles to prevent flashing at (0,0)
    const safeStyles = computed<CSSProperties>(() => {
      if (!isPositionedCorrectly.value) {
        return {
          ...floatingStyles.value,
          position: 'fixed' as const,
          top: '-10000px',
          left: '-10000px',
          opacity: 0,
          visibility: 'hidden' as const,
          transition: 'none',
        } as CSSProperties
      }

      const baseTransform = (floatingStyles.value.transform as string) || ''
      return {
        ...floatingStyles.value,
        opacity: isVisible.value ? 1 : 0,
        visibility: isVisible.value ? 'visible' : 'hidden',
        pointerEvents: isVisible.value ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        transform: `${baseTransform} scale(${isVisible.value ? 1 : 0.95})`,
      } as CSSProperties
    })

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen.value &&
        reference.value &&
        !reference.value.contains(e.target as Node) &&
        floating.value &&
        !floating.value.contains(e.target as Node)
      ) {
        close()
      }
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen.value) {
        e.stopPropagation()
        close()
        // Return focus to trigger
        reference.value?.querySelector('button')?.focus()
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
    })

    expose({ isOpen, isVisible })

    return () => (
      <div class="vue3-colorful__popover-wrapper">
        <div
          ref={reference}
          class="vue3-colorful__popover-trigger"
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={isOpen.value}
        >
          {slots.default ? (
            slots.default({ isOpen: isOpen.value, color: props.modelValue })
          ) : (
            <button
              type="button"
              class="vue3-colorful__swatch-trigger"
              style={{ backgroundColor: props.modelValue }}
              aria-label="Choose color"
            />
          )}
        </div>

        <Teleport to="body">
          {isOpen.value && (
            <div ref={floating} style={safeStyles.value} class="vue3-colorful__popover-content">
              <ColorPicker
                {...props}
                onUpdate:modelValue={(val) => emit('update:modelValue', val)}
                v-slots={slots}
              />
            </div>
          )}
        </Teleport>
      </div>
    )
  },
})
