import { describe, it, expect, vi } from 'vitest'

// Mock @nuxt/kit before importing the module
vi.mock('@nuxt/kit', () => ({
  defineNuxtModule: (options: any) => options,
  addComponent: vi.fn(),
  createResolver: () => ({ resolve: (p: string) => p }),
}))

import tailwindPlugin from '../src/plugins/tailwind'
import unocssPreset from '../src/plugins/unocss'
import nuxtModule from '../src/plugins/nuxt'

describe('Ecosystem Plugins', () => {
  it('tailwindPlugin exercises its handler', () => {
    const addBase = vi.fn()
    const theme = vi.fn().mockReturnValue({
      accentColor: '#3b82f6',
      borderRadius: '12px',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(tailwindPlugin as any).handler({ addBase, theme })
    expect(addBase).toHaveBeenCalled()
  })

  it('unocssPreset exercises its preflight getCSS', () => {
    const preset = (unocssPreset as any)()
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
    ;(tailwindPlugin as any).handler({ addBase, theme })
    expect(addBase).not.toHaveBeenCalled()
  })

  it('unocssPreset handles empty config', () => {
    const preset = (unocssPreset as any)()
    const getCSS = preset.preflights[0].getCSS
    const css = getCSS({ theme: {} })
    expect(css).toBe('')
  })

  it('nuxtModule respects disableCss option', () => {
    const nuxt = {
      options: {
        css: [],
      },
    }
    if (typeof (nuxtModule as any).setup === 'function') {
      ;(nuxtModule as any).setup({ disableCss: true }, nuxt)
    }
    expect(nuxt.options.css).not.toContain('./vue3-colorful.css')
  })

  it('nuxtModule handles default setup', () => {
    const nuxt = {
      options: {
        css: [],
      },
    }
    if (typeof (nuxtModule as any).setup === 'function') {
      ;(nuxtModule as any).setup(undefined, nuxt)
    }
    expect(nuxt.options.css).toContain('./vue3-colorful.css')
  })

  it('nuxtModule exercises its setup', () => {
    const nuxt = {
      options: {
        css: [],
      },
    }

    // With @nuxt/kit mocked, nuxtModule is just the options object
    if (typeof (nuxtModule as any).setup === 'function') {
      ;(nuxtModule as any).setup({}, nuxt)
    }
    expect(nuxt.options.css).toContain('./vue3-colorful.css')
  })
})
