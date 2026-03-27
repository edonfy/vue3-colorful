import { defineComponent, ref } from 'vue'
import CodeBlock from './CodeBlock'

type Tab = 'demo' | 'code'

export default defineComponent({
  name: 'ComponentCard',
  props: {
    title: { type: String, required: true },
    codeSnippet: { type: String, required: true },
  },
  setup(props, { slots }) {
    const activeTab = ref<Tab>('demo')

    return () => (
      <div class="component-card">
        <div class="component-card__header">
          <span class="component-card__title">{props.title}</span>
          <div class="component-card__tabs">
            <button
              class={[
                'component-card__tab',
                activeTab.value === 'demo' && 'component-card__tab--active',
              ]}
              onClick={() => {
                activeTab.value = 'demo'
              }}
            >
              Demo
            </button>
            <button
              class={[
                'component-card__tab',
                activeTab.value === 'code' && 'component-card__tab--active',
              ]}
              onClick={() => {
                activeTab.value = 'code'
              }}
            >
              Code
            </button>
          </div>
        </div>
        <div class="component-card__body">
          {activeTab.value === 'demo' ? (
            <div class="component-card__demo">{slots.default?.()}</div>
          ) : (
            <CodeBlock code={props.codeSnippet} language="tsx" />
          )}
        </div>
      </div>
    )
  },
})
