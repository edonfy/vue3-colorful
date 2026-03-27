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
import PopoverTrigger from './PopoverTrigger'
import { AnyColor, ColorModel } from '../types'
import { getColorDisplayValue } from '../utils/converter'
import { useTransitionStatus } from '../composables/useTransitionStatus'

let popoverPanelId = 0

export default defineComponent({
  name: 'ColorPickerPopover',
  inheritAttrs: false,
  props: {
    ...commonPickerProps,
    colorModel: {
      type: String as PropType<ColorModel>,
      default: 'hex',
    },
  },
  emits: ['update:modelValue', 'active-change'],
  setup(props, { emit, slots, expose, attrs }) {
    const isOpen = ref(false)
    const reference = ref<HTMLElement | null>(null)
    const floating = ref<HTMLElement | null>(null)
    const triggerColor = computed(() => getColorDisplayValue(props.modelValue))
    popoverPanelId += 1
    const panelId = `vue3-colorful-popover-panel-${popoverPanelId}`

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
      const focusable = reference.value?.matches(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
        ? reference.value
        : reference.value?.querySelector<HTMLElement>(
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
      <div
        {...attrs}
        class={[
          'vue3-colorful-theme',
          'vue3-colorful__popover-wrapper',
          props.dark && 'vue3-colorful-theme--dark',
          attrs.class,
        ]}
      >
        <PopoverTrigger
          referenceRef={reference}
          color={props.modelValue}
          displayColor={triggerColor.value}
          disabled={props.disabled}
          readOnly={props.readOnly}
          isOpen={isOpen.value}
          panelId={panelId}
          labels={props.labels}
          onToggle={toggle}
          v-slots={{
            default: slots.default,
          }}
        />

        <Teleport to="body">
          {isMounted.value && (
            <div
              id={panelId}
              ref={floating}
              style={floatingStyles.value}
              class={[
                'vue3-colorful-theme',
                'vue3-colorful__popover-content',
                props.dark && 'vue3-colorful-theme--dark',
              ]}
              role="dialog"
              aria-modal="false"
              tabindex={-1}
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
