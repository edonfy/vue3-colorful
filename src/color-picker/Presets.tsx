import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Presets',

  props: {
    presets: {
      type: Array as PropType<string[]>,
      required: true,
    },
    activeColor: {
      type: String,
      default: '',
    },
  },

  emits: ['select'],

  setup(props, { emit }) {
    return () => (
      <div class="vue3-colorful__presets">
        {props.presets.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            class={[
              'vue3-colorful__preset',
              props.activeColor.toLowerCase() === color.toLowerCase() &&
                'vue3-colorful__preset--active',
            ]}
            style={{ backgroundColor: color }}
            onClick={() => emit('select', color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    )
  },
})
