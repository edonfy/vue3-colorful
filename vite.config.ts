import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
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
    UnoCSS(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, './src/index.ts'),
        tailwind: resolve(__dirname, './src/plugins/tailwind.ts'),
        unocss: resolve(__dirname, './src/plugins/unocss.ts'),
        nuxt: resolve(__dirname, './src/plugins/nuxt.ts'),
      },
      name: 'vue3-colorful',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', 'tailwindcss/plugin', 'unocss', '@nuxt/kit'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
})
