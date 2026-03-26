import {
  computed,
  defineComponent,
  ref,
  PropType,
  onMounted,
  onUnmounted,
  Teleport,
  watch,
  nextTick,
} from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { commonPickerProps } from './commonPickerProps'
import ColorPickerPanel from './ColorPickerPanel'
import { AnyColor, ColorModel } from '../types'
import { getColorDisplayValue } from '../utils/converter'
import { useTransitionStatus } from '../composables/useTransitionStatus'

export default defineComponent({
  name: 'ColorPickerPopover',
  props: {
    ...commonPickerProps,
    colorModel: {
      type: String as PropType<ColorModel>,
      default: 'hex',
    },
  },
  emits: ['update:modelValue', 'active-change'],
  setup(props, { emit, slots, expose }) {
    const isOpen = ref(false)
    const reference = ref<HTMLElement | null>(null)
    const floating = ref<HTMLElement | null>(null)
    const triggerColor = computed(() => getColorDisplayValue(props.modelValue))

    const { floatingStyles } = useFloating(reference, floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
      transform: false,
    })

    const { status, isMounted, onTransitionEnd } = useTransitionStatus(isOpen)

    const open = () => {
      if (props.disabled) return
      isOpen.value = true
    }

    const toggle = () => {
      if (props.disabled) return
      isOpen.value = !isOpen.value
    }

    const close = () => {
      isOpen.value = false
    }

    const focusTrigger = async () => {
      await nextTick()
      const focusable = reference.value?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusable) {
        focusable.focus()
        return
      }

      reference.value?.focus()
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
        void focusTrigger()
      }
    }

    const handleTriggerKeydown = (e: KeyboardEvent) => {
      if (props.disabled) {
        return
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
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

    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) {
          close()
        }
      }
    )

    expose({ isOpen, open, close, toggle, focusTrigger })

    return () => (
      <div class="vue3-colorful__popover-wrapper">
        <div
          ref={reference}
          class={[
            'vue3-colorful__popover-trigger',
            props.disabled && 'vue3-colorful__popover-trigger--disabled',
          ]}
          onClick={() => {
            if (props.disabled) return
            toggle()
          }}
          onKeydown={handleTriggerKeydown}
          aria-haspopup="true"
          aria-expanded={isOpen.value}
          aria-disabled={props.disabled ? 'true' : undefined}
          tabindex={props.disabled ? -1 : 0}
        >
          {slots.default ? (
            slots.default({
              isOpen: isOpen.value,
              color: props.modelValue,
              disabled: props.disabled,
              readOnly: props.readOnly,
            })
          ) : (
            <button
              type="button"
              class="vue3-colorful__swatch-trigger"
              style={{ backgroundColor: triggerColor.value }}
              aria-label="Choose color"
              disabled={props.disabled}
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
              <ColorPickerPanel
                {...props}
                onUpdate:modelValue={(val: AnyColor) => emit('update:modelValue', val)}
                onActive-change={(val: AnyColor) => emit('active-change', val)}
                v-slots={slots}
              />
            </div>
          )}
        </Teleport>
      </div>
    )
  },
})
