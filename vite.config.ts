import { defineConfig } from 'vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const plugins = [VueJsx()]

if (process.env.ANALYZE) {
  plugins.push(
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
      open: true,
    })
  )
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(packageJson.version),
  },
  plugins,
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, './src/index.ts'),
        tailwind: resolve(__dirname, './src/plugins/tailwind.ts'),
      },
      name: 'vue3-colorful',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@floating-ui/vue', 'tailwindcss/plugin'],
      output: {
        globals: {
          vue: 'Vue',
          '@floating-ui/vue': 'FloatingUIVue',
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
    host: 'localhost',
  },
})
