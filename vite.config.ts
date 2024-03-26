import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    __VERSION__: JSON.stringify(require('./package.json').version),
  },
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'VueColorful',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
      },
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    }
  },
})
