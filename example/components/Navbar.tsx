import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { VERSION } from '@/index'
import { GITHUB_REPO_URL } from '../constants'

const NAV_ITEMS = [
  { id: 'playground', label: 'Playground' },
  { id: 'components', label: 'Components' },
  { id: 'theming', label: 'Theming' },
  { id: 'quickstart', label: 'Quick Start' },
]

export default defineComponent({
  name: 'Navbar',
  setup() {
    const activeSection = ref('playground')
    let observer: IntersectionObserver | null = null

    const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    onMounted(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeSection.value = entry.target.id
            }
          }
        },
        { rootMargin: '-20% 0px -60% 0px' }
      )
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    })

    onUnmounted(() => {
      observer?.disconnect()
    })

    return () => (
      <nav class="navbar">
        <div class="navbar__inner">
          <div class="navbar__brand">
            <span class="navbar__logo">vue3-colorful</span>
            <span class="navbar__version">v{VERSION}</span>
          </div>
          <div class="navbar__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                class={['navbar__link', activeSection.value === item.id && 'navbar__link--active']}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a class="navbar__github" href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>
    )
  },
})
