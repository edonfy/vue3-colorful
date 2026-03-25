import { describe, it, expect, vi } from 'vitest'

// Mock @nuxt/kit before importing the module
vi.mock('@nuxt/kit', () => ({
  defineNuxtModule: (options: Record<string, unknown>) => options,
  addComponent: vi.fn(),
  createResolver: () => ({ resolve: (p: string) => p }),
}))

import tailwindPlugin from '../src/plugins/tailwind'
import unocssPreset from '../src/plugins/unocss'
import nuxtModule from '../src/plugins/nuxt'

// Type helpers for plugin internals accessed in tests
interface TailwindPluginWithHandler {
  handler: (api: { addBase: ReturnType<typeof vi.fn>; theme: ReturnType<typeof vi.fn> }) => void
}

interface UnocssPreset {
  (): { preflights: Array<{ getCSS: (ctx: { theme: Record<string, unknown> }) => string }> }
}

interface NuxtModuleWithOptions {
  setup: (
    options: { disableCss?: boolean } | undefined,
    nuxt: { options: { css: string[] } }
  ) => void
}

describe('Ecosystem Plugins', () => {
  it('tailwindPlugin exercises its handler', () => {
    const addBase = vi.fn()
    const theme = vi.fn().mockReturnValue({
      accentColor: '#3b82f6',
      borderRadius: '12px',
    })

    const plugin = tailwindPlugin as unknown as TailwindPluginWithHandler
    plugin.handler({ addBase, theme })
    expect(addBase).toHaveBeenCalled()
  })

  it('unocssPreset exercises its preflight getCSS', () => {
    const presetFactory = unocssPreset as unknown as UnocssPreset
    const preset = presetFactory()
    const getCSS = preset.preflights[0].getCSS

    const css = getCSS({
      theme: {
        vue3Colorful: {
          accentColor: '#3b82f6',
        },
      },
    })

    expect(css).toContain('--vc-accent-color: #3b82f6;')
  })

  it('tailwindPlugin handles empty config', () => {
    const addBase = vi.fn()
    const theme = vi.fn().mockReturnValue(undefined)

    const plugin = tailwindPlugin as unknown as TailwindPluginWithHandler
    plugin.handler({ addBase, theme })
    expect(addBase).not.toHaveBeenCalled()
  })

  it('unocssPreset handles empty config', () => {
    const presetFactory = unocssPreset as unknown as UnocssPreset
    const preset = presetFactory()
    const getCSS = preset.preflights[0].getCSS
    const css = getCSS({ theme: {} })
    expect(css).toBe('')
  })

  it('nuxtModule respects disableCss option', () => {
    const nuxt = { options: { css: [] as string[] } }
    const mod = nuxtModule as unknown as NuxtModuleWithOptions
    if (typeof mod.setup === 'function') {
      mod.setup({ disableCss: true }, nuxt)
    }
    expect(nuxt.options.css).not.toContain('./vue3-colorful.css')
  })

  it('nuxtModule handles default setup', () => {
    const nuxt = { options: { css: [] as string[] } }
    const mod = nuxtModule as unknown as NuxtModuleWithOptions
    if (typeof mod.setup === 'function') {
      mod.setup(undefined, nuxt)
    }
    expect(nuxt.options.css).toContain('./vue3-colorful.css')
  })

  it('nuxtModule exercises its setup', () => {
    const nuxt = { options: { css: [] as string[] } }
    const mod = nuxtModule as unknown as NuxtModuleWithOptions
    if (typeof mod.setup === 'function') {
      mod.setup({}, nuxt)
    }
    expect(nuxt.options.css).toContain('./vue3-colorful.css')
  })
})
