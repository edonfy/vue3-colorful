import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/vue3-vite',
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    const { default: UnoCSS } = await import('unocss/vite')
    const { default: VueJsx } = await import('@vitejs/plugin-vue-jsx')

    const { resolve } = await import('path')
    return mergeConfig(config, {
      plugins: [VueJsx(), UnoCSS()],
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
        },
      },
    })
  },
}

export default config
