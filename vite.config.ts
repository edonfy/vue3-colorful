import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'vue3-colorful',
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
