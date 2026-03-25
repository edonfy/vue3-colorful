import { defineComponent, ref, PropType, onMounted, onUnmounted, Teleport } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { commonPickerProps } from './PickerFactory'
import ColorPicker from './ColorPicker'
import { ColorModel } from '@/types'
import { useTransitionStatus } from '@/composables/useTransitionStatus'

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

    const { floatingStyles } = useFloating(reference, floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
      transform: false,
    })

    const { status, isMounted, onTransitionEnd } = useTransitionStatus(isOpen)

    const toggle = () => (isOpen.value = !isOpen.value)
    const close = () => {
      isOpen.value = false
    }

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
        reference.value?.focus()
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

    expose({ isOpen })

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
          {isMounted.value && (
            <div
              ref={floating}
              style={floatingStyles.value}
              class="vue3-colorful__popover-content"
              data-status={status.value}
              onTransitionend={onTransitionEnd}
            >
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
