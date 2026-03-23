import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})