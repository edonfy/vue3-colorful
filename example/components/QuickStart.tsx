import { defineComponent } from 'vue'
import CodeBlock from './CodeBlock'

const INSTALL_CODE = `pnpm add vue3-colorful`

const IMPORT_CODE = `import { HexColorPicker } from 'vue3-colorful'`

const USAGE_CODE = `import { defineComponent, ref } from 'vue'
import { HexColorPicker } from 'vue3-colorful'

export default defineComponent({
  name: 'MyColorPicker',
  setup() {
    const color = ref('#3b82f6')
    return () => <HexColorPicker v-model={color.value} />
  },
})`

export default defineComponent({
  name: 'QuickStart',
  setup() {
    return () => (
      <section id="quickstart" class="quickstart">
        <h2 class="section-title">Quick Start</h2>
        <p class="section-description">
          Get up and running with vue3-colorful in three simple steps.
        </p>

        <div class="quickstart__steps">
          <div class="quickstart__step">
            <span class="quickstart__step-number">1</span>
            <h3 class="quickstart__step-title">Install</h3>
            <CodeBlock code={INSTALL_CODE} language="bash" />
          </div>
          <div class="quickstart__step">
            <span class="quickstart__step-number">2</span>
            <h3 class="quickstart__step-title">Import</h3>
            <CodeBlock code={IMPORT_CODE} language="tsx" />
          </div>
          <div class="quickstart__step">
            <span class="quickstart__step-number">3</span>
            <h3 class="quickstart__step-title">Use</h3>
            <CodeBlock code={USAGE_CODE} language="tsx" />
          </div>
        </div>
      </section>
    )
  },
})
