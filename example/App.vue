<script setup lang="ts">
import { CSSProperties, computed, ref } from 'vue'
import {
  HexColorPicker,
  RgbColorPicker,
  HslColorPicker,
  HsvColorPicker,
  CmykColorPicker,
} from '../src'

const hexColor = ref<string>('#3b82f6')
const rgbColor = ref<string>('rgba(16, 185, 129, 0.8)')
const hsvColor = ref<string>('hsv(38, 93, 96)')
const hslColor = ref<string>('hsl(346, 84%, 61%)')
const cmykColor = ref<string>('cmyk(0%, 50%, 100%, 0%)')

const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert(`Copied: ${text}`)
}

const previewStyle = computed<CSSProperties>(() => ({
  backgroundColor: hexColor.value,
}))
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans transition-colors duration-300"
  >
    <header class="max-w-6xl mx-auto mb-12 text-center">
      <h1
        class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4"
      >
        Vue3-Colorful
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        A tiny, high-performance, and tree-shakable color picker for Vue 3
      </p>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Hex Picker (Large) -->
      <section
        class="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20"
      >
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-blue-500 rounded-full"></span>
          Modular Hex Picker
        </h2>
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="w-full max-w-300px">
            <hex-color-picker v-model="hexColor" show-eyedropper :presets="presets" show-alpha />
          </div>
          <div class="flex-1 space-y-6 w-full">
            <div
              class="w-full h-40 rounded-2xl shadow-inner border border-black/5 transition-colors duration-200"
              :style="previewStyle"
            ></div>
            <div class="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
              <code class="text-lg font-mono">{{ hexColor }}</code>
              <button
                class="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all"
                @click="copyToClipboard(hexColor)"
              >
                Copy
              </button>
            </div>
            <p class="text-sm text-gray-500">
              Now with native <strong>Eyedropper API</strong> support and
              <strong>Color Presets</strong>.
            </p>
          </div>
        </div>
      </section>

      <!-- RGBA Picker -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <h3 class="text-xl font-bold mb-4">Tree-shakable RGB</h3>
        <rgb-color-picker v-model="rgbColor" show-alpha />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ rgbColor }}</code>
          <button class="text-xs text-blue-500 underline" @click="copyToClipboard(rgbColor)">
            Copy
          </button>
        </div>
      </section>

      <!-- HSV Picker -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <h3 class="text-xl font-bold mb-4">HSV Specific</h3>
        <hsv-color-picker v-model="hsvColor" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ hsvColor }}</code>
          <button class="text-xs text-blue-500 underline" @click="copyToClipboard(hsvColor)">
            Copy
          </button>
        </div>
      </section>

      <!-- HSL Picker -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <h3 class="text-xl font-bold mb-4">HSL Specific</h3>
        <hsl-color-picker v-model="hslColor" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ hslColor }}</code>
          <button class="text-xs text-blue-500 underline" @click="copyToClipboard(hslColor)">
            Copy
          </button>
        </div>
      </section>

      <!-- CMYK Picker -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <h3 class="text-xl font-bold mb-4">CMYK Specific</h3>
        <cmyk-color-picker v-model="cmykColor" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ cmykColor }}</code>
          <button class="text-xs text-blue-500 underline" @click="copyToClipboard(cmykColor)">
            Copy
          </button>
        </div>
      </section>
    </main>

    <footer class="mt-16 text-center text-gray-500 dark:text-gray-400">
      <p>Supports keyboard navigation (Tab & Arrow keys) & Screen Readers</p>
    </footer>
  </div>
</template>

<style>
/* Reset and global styles */
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom transitions for ColorPicker */
.vue3-colorful {
  width: 100% !important;
  height: 250px !important;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
