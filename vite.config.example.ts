import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/vue3-colorful/',
  plugins: [Vue(), VueJsx(), UnoCSS()],
  build: {
    outDir: 'dist-example',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },
})
