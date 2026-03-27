import { cloneVNode, defineComponent, isVNode, PropType, Ref, VNode } from 'vue'
import { AnyColor } from '../types'

export default defineComponent({
  name: 'PopoverTrigger',

  props: {
    referenceRef: {
      type: Object as PropType<Ref<HTMLElement | null>>,
      required: true,
    },
    color: {
      type: [String, Object] as PropType<AnyColor>,
      default: '',
    },
    displayColor: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    panelId: {
      type: String,
      required: true,
    },
  },

  emits: ['toggle'],

  setup(props, { emit, slots }) {
    const slotProps = () => ({
      isOpen: props.isOpen,
      color: props.color,
      disabled: props.disabled,
      readOnly: props.readOnly,
      toggle: handleToggle,
    })

    const handleToggle = () => {
      if (props.disabled) {
        return
      }

      emit('toggle')
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (props.disabled) {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleToggle()
      }
    }

    const renderLegacySlotTrigger = (nodes: VNode[]) => (
      <div
        ref={props.referenceRef}
        class={[
          'vue3-colorful__popover-trigger',
          props.disabled && 'vue3-colorful__popover-trigger--disabled',
        ]}
        onClick={handleToggle}
        onKeydown={handleKeydown}
        role="button"
        tabindex={props.disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={props.isOpen ? 'true' : 'false'}
        aria-controls={props.panelId}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-readonly={props.readOnly ? 'true' : undefined}
      >
        {nodes}
      </div>
    )

    const renderCustomTrigger = () => {
      const nodes = slots.default?.(slotProps()) ?? []
      const triggerNode = nodes.length === 1 && isVNode(nodes[0]) ? nodes[0] : null

      if (!triggerNode || typeof triggerNode.type !== 'string') {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[vue3-colorful] ColorPickerPopover custom trigger should return a single native element.'
          )
        }

        return renderLegacySlotTrigger(nodes as VNode[])
      }

      const isButton = triggerNode.type === 'button'

      return cloneVNode(
        triggerNode,
        {
          ref: props.referenceRef,
          class: [
            'vue3-colorful__popover-trigger',
            props.disabled && 'vue3-colorful__popover-trigger--disabled',
          ],
          onClick: handleToggle,
          type: isButton
            ? ((triggerNode.props?.type as string | undefined) ?? 'button')
            : undefined,
          disabled: isButton ? props.disabled : undefined,
          role: isButton ? undefined : 'button',
          tabindex: isButton ? undefined : props.disabled ? -1 : 0,
          onKeydown: isButton ? undefined : handleKeydown,
          'aria-haspopup': 'dialog',
          'aria-expanded': props.isOpen ? 'true' : 'false',
          'aria-controls': props.panelId,
          'aria-disabled': props.disabled ? 'true' : undefined,
          'aria-readonly': props.readOnly ? 'true' : undefined,
        },
        true
      )
    }

    return () =>
      slots.default ? (
        renderCustomTrigger()
      ) : (
        <button
          ref={props.referenceRef}
          type="button"
          class={[
            'vue3-colorful__popover-trigger',
            'vue3-colorful__swatch-trigger',
            props.disabled && 'vue3-colorful__popover-trigger--disabled',
          ]}
          style={{ backgroundColor: props.displayColor }}
          onClick={handleToggle}
          aria-label="Choose color"
          aria-haspopup="dialog"
          aria-expanded={props.isOpen ? 'true' : 'false'}
          aria-controls={props.panelId}
          aria-disabled={props.disabled ? 'true' : undefined}
          aria-readonly={props.readOnly ? 'true' : undefined}
          disabled={props.disabled}
        />
      )
  },
})
