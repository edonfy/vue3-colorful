import { defineConfig } from 'vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vue3-colorful/' : '/',
  define: {
    __VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [VueJsx()],
  build: {
    outDir: 'dist-example',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },
}))
