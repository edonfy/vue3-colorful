import { describe, it, expect, vi } from 'vitest'

import tailwindPlugin from '../src/plugins/tailwind'

// Type helpers for plugin internals accessed in tests
interface TailwindPluginWithHandler {
  handler: (api: { addBase: ReturnType<typeof vi.fn>; theme: ReturnType<typeof vi.fn> }) => void
}

describe('Ecosystem Plugins', () => {
  it('tailwindPlugin exercises its handler', () => {
    const addBase = vi.fn()
    const theme = vi.fn().mockReturnValue({
      accentColor: '#3b82f6',
      borderRadius: '12px',
      inputBgColor: '#f3f4f6',
      shadow: '0 0 0 1px rgba(0,0,0,0.1)',
    })

    const plugin = tailwindPlugin as unknown as TailwindPluginWithHandler
    plugin.handler({ addBase, theme })
    expect(addBase).toHaveBeenCalled()
  })

  it('tailwindPlugin handles empty config', () => {
    const addBase = vi.fn()
    const theme = vi.fn().mockReturnValue(undefined)

    const plugin = tailwindPlugin as unknown as TailwindPluginWithHandler
    plugin.handler({ addBase, theme })
    expect(addBase).not.toHaveBeenCalled()
  })
})
