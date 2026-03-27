import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Hero',
  setup() {
    return () => (
      <header class="hero">
        <h1 class="hero__title">vue3-colorful</h1>
        <p class="hero__subtitle">
          Lightweight, accessible color pickers for Vue 3. Built with TSX render functions and
          designed for app-level theming.
        </p>
        <code class="hero__install">pnpm add vue3-colorful</code>
      </header>
    )
  },
})
