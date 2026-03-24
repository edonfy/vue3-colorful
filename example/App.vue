<script setup lang="ts">
import { CSSProperties, computed, ref } from 'vue'
import ColorPicker from '../src'

const hexColor = ref<string>('#ff6600')
const rgbColor = ref<string>('rgba(255, 102, 0, 0.8)')
const hsvColor = ref<string>('hsv(24, 100, 100)')
const hslColor = ref<string>('hsl(24, 100%, 50%)')
const cmykColor = ref<string>('cmyk(0%, 60%, 100%, 0%)')

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert(`Copied: ${text}`)
}

const previewStyle = computed<CSSProperties>(() => ({
  backgroundColor: hexColor.value
}))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans transition-colors duration-300">
    <header class="max-w-6xl mx-auto mb-12 text-center">
      <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 mb-4">
        Vue3-Colorful
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        A tiny, high-performance, and accessible color picker for Vue 3
      </p>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Hex Picker (Large) -->
      <section class="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-orange-500 rounded-full"></span>
          Main Editor (Hex)
        </h2>
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="w-full max-w-300px">
             <color-picker v-model="hexColor" />
          </div>
          <div class="flex-1 space-y-6 w-full">
            <div 
              class="w-full h-40 rounded-2xl shadow-inner border border-black/5 transition-colors duration-200"
              :style="previewStyle"
            ></div>
            <div class="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <code class="text-lg font-mono">{{ hexColor }}</code>
              <button 
                @click="copyToClipboard(hexColor)"
                class="px-4 py-2 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-lg shadow-sm transition-all"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RGBA Picker -->
      <section class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
        <h3 class="text-xl font-bold mb-4">RGB with Alpha</h3>
        <color-picker v-model="rgbColor" color-model="rgb" :show-alpha="true" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ rgbColor }}</code>
          <button @click="copyToClipboard(rgbColor)" class="text-xs text-blue-500 underline">Copy</button>
        </div>
      </section>

      <!-- HSV Picker -->
      <section class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
        <h3 class="text-xl font-bold mb-4">HSV Format</h3>
        <color-picker v-model="hsvColor" color-model="hsv" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ hsvColor }}</code>
          <button @click="copyToClipboard(hsvColor)" class="text-xs text-blue-500 underline">Copy</button>
        </div>
      </section>

      <!-- HSL Picker -->
      <section class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
        <h3 class="text-xl font-bold mb-4">HSL Format</h3>
        <color-picker v-model="hslColor" color-model="hsl" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ hslColor }}</code>
          <button @click="copyToClipboard(hslColor)" class="text-xs text-blue-500 underline">Copy</button>
        </div>
      </section>

      <!-- CMYK Picker -->
      <section class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
        <h3 class="text-xl font-bold mb-4">CMYK Format</h3>
        <color-picker v-model="cmykColor" color-model="cmyk" />
        <div class="mt-4 flex items-center justify-between">
          <code class="text-sm font-mono truncate mr-2">{{ cmykColor }}</code>
          <button @click="copyToClipboard(cmykColor)" class="text-xs text-blue-500 underline">Copy</button>
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
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>

