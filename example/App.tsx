import { defineComponent, ref } from 'vue'

import { CmykColorPicker, HexColorPicker, ColorPickerPanel, ColorPickerPopover } from '@/index'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Playground from './components/Playground'
import ComponentShowcase from './components/ComponentShowcase'
import ThemingShowcase from './components/ThemingShowcase'
import QuickStart from './components/QuickStart'

import { GROUPED_PRESETS } from './constants'

// --- Visual Regression View Router ---

type DemoView = 'showcase' | 'hex' | 'popover' | 'cmyk' | 'panel' | 'disabled'

function getDemoView(): DemoView {
  if (typeof window === 'undefined') {
    return 'showcase'
  }

  const view = new URLSearchParams(window.location.search).get('view')
  if (
    view === 'hex' ||
    view === 'popover' ||
    view === 'cmyk' ||
    view === 'panel' ||
    view === 'disabled'
  ) {
    return view
  }

  return 'showcase'
}

// --- Main App ---

export default defineComponent({
  name: 'ExampleApp',
  setup() {
    const view = getDemoView()

    // Shared state for visual regression views
    const hexColor = ref('#3b82f6')
    const cmykColor = ref('cmyk(0%, 50%, 100%, 0%)')
    const popoverColor = ref('#8b5cf6')

    return () => {
      // Visual regression: ?view=hex
      if (view === 'hex') {
        return (
          <div class={['demo-container', 'demo-container--visual']}>
            <section data-testid="hex-picker">
              <HexColorPicker
                v-model={hexColor.value}
                presets={GROUPED_PRESETS}
                showInput
                showRecent
                copyFormats={['hex', 'rgb']}
                showContrast
                colorLabel="HEX"
                style={{ '--vc-height': '268px' }}
              />
            </section>
          </div>
        )
      }

      // Visual regression: ?view=cmyk
      if (view === 'cmyk') {
        return (
          <div class={['demo-container', 'demo-container--visual']}>
            <section data-testid="cmyk-picker">
              <CmykColorPicker v-model={cmykColor.value} />
            </section>
          </div>
        )
      }

      // Visual regression: ?view=popover
      if (view === 'popover') {
        return (
          <div class={['demo-container', 'demo-container--visual']}>
            <section class="demo-popover-visual">
              <ColorPickerPopover v-model={popoverColor.value} showInput />
            </section>
          </div>
        )
      }

      // Visual regression: ?view=panel
      if (view === 'panel') {
        return (
          <div class={['demo-container', 'demo-container--visual']}>
            <section data-testid="panel-picker">
              <ColorPickerPanel v-model={hexColor.value} showInput clearable colorLabel="HEX" />
            </section>
          </div>
        )
      }

      // Visual regression: ?view=disabled
      if (view === 'disabled') {
        return (
          <div class={['demo-container', 'demo-container--visual']}>
            <section data-testid="disabled-picker">
              <HexColorPicker
                v-model={hexColor.value}
                showInput
                clearable
                disabled
                presets={GROUPED_PRESETS}
                colorLabel="HEX"
              />
            </section>
          </div>
        )
      }

      // Default: new modular layout
      return (
        <div class="app">
          <Navbar />
          <main class="main">
            <Hero />
            <Playground />
            <ComponentShowcase />
            <ThemingShowcase />
            <QuickStart />
          </main>
          <footer class="footer">
            <p>&copy; 2024 vue3-colorful &bull; MIT Licensed</p>
          </footer>
        </div>
      )
    }
  },
})
