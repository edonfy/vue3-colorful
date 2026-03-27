import { defineComponent, ref, PropType } from 'vue'

export default defineComponent({
  name: 'CodeBlock',
  props: {
    code: { type: String, required: true },
    language: { type: String as PropType<'tsx' | 'bash'>, default: 'tsx' },
  },
  setup(props) {
    const copied = ref(false)

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(props.code)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch {
        console.warn('[vue3-colorful] Failed to copy code')
      }
    }

    return () => (
      <div class="code-block">
        <button class="code-block__copy" onClick={handleCopy}>
          {copied.value ? 'Copied!' : 'Copy'}
        </button>
        <pre class="code-block__pre">
          <code class={`code-block__code code-block__code--${props.language}`}>{props.code}</code>
        </pre>
      </div>
    )
  },
})
