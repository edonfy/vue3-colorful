import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS()
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
        exports: 'named',
      },
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
