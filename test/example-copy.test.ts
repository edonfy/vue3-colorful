import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/index', () => ({
  ColorPicker: defineComponent({
    name: 'ColorPicker',
    setup() {
      return () => h('div', { class: 'color-picker-stub' })
    },
  }),
}))

import CodeBlock from '../example/components/CodeBlock'
import Playground from '../example/components/Playground'

interface ClipboardNavigator extends Navigator {
  clipboard: {
    writeText: (text: string) => Promise<void>
  }
}

const flushClipboardTask = async (): Promise<void> => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('example copy actions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('falls back when copying code snippets if the Clipboard API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    const execCommand = vi.fn(() => true)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.stubGlobal('navigator', {
      ...window.navigator,
      clipboard: { writeText },
    } satisfies ClipboardNavigator)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })

    const wrapper = mount(CodeBlock, {
      props: {
        code: 'pnpm add vue3-colorful',
      },
    })

    await wrapper.find('.code-block__copy').trigger('click')
    await flushClipboardTask()

    expect(writeText).toHaveBeenCalledWith('pnpm add vue3-colorful')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(wrapper.find('.code-block__copy').text()).toBe('Copied!')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('falls back when copying the playground preview value if the Clipboard API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    const execCommand = vi.fn(() => true)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.stubGlobal('navigator', {
      ...window.navigator,
      clipboard: { writeText },
    } satisfies ClipboardNavigator)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })

    const wrapper = mount(Playground)

    await wrapper.find('.playground__preview-value').trigger('click')
    await flushClipboardTask()

    expect(writeText).toHaveBeenCalledWith('#6366f1')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
