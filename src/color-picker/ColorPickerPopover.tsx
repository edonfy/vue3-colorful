import { defineComponent, ref, PropType, onMounted, onUnmounted } from 'vue'
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
  setup(props, { emit, slots }) {
    const isOpen = ref(false)
    const reference = ref<HTMLElement | null>(null)
    const floating = ref<HTMLElement | null>(null)

    const { floatingStyles } = useFloating(reference, floating, {
      placement: 'bottom-start',
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
    })

    const toggle = () => (isOpen.value = !isOpen.value)
    const close = () => (isOpen.value = false)

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

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return () => (
      <div class="vue3-colorful__popover-wrapper">
        <div ref={reference} class="vue3-colorful__popover-trigger" onClick={toggle}>
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

        {isOpen.value && (
          <div ref={floating} style={floatingStyles.value} class="vue3-colorful__popover-content">
            <ColorPicker
              {...props}
              onUpdate:modelValue={(val) => emit('update:modelValue', val)}
              v-slots={slots}
            />
          </div>
        )}
      </div>
    )
  },
})
