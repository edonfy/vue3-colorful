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

const isDark = ref(false)
const isVertical = ref(false)

const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert(`Copied: ${text}`)
}

const previewStyle = computed<CSSProperties>(() => ({
  backgroundColor: hexColor.value,
}))

const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div
    :class="[
      'min-h-screen p-8 font-sans transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900',
    ]"
  >
    <header class="max-w-6xl mx-auto mb-12 flex flex-col items-center">
      <div class="flex justify-between w-full items-center mb-4">
        <div />
        <h1
          class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600"
        >
          Vue3-Colorful
        </h1>
        <button
          class="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Dark Mode"
          @click="toggleDark"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        A tiny, high-performance, and tree-shakable color picker for Vue 3
      </p>
    </header>

    <main class="max-w-6xl mx-auto space-y-12">
      <!-- Main Showcase -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20"
      >
        <div class="flex flex-col lg:flex-row gap-12 items-start">
          <div class="w-full lg:w-1/2 space-y-8">
            <h2 class="text-3xl font-bold flex items-center gap-3">
              <span class="w-2 h-10 bg-blue-500 rounded-full"></span>
              Premium Features
            </h2>
            <div
              class="w-full h-48 rounded-2xl shadow-inner border border-black/5 transition-colors duration-200"
              :style="previewStyle"
            ></div>
            <div
              class="flex items-center justify-between p-5 bg-gray-100 dark:bg-gray-900/50 rounded-2xl"
            >
              <code class="text-xl font-mono">{{ hexColor }}</code>
              <button
                class="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl shadow-sm transition-all text-sm font-semibold"
                @click="copyToClipboard(hexColor)"
              >
                Copy Hex
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <strong>Manual Input</strong>: Real-time validation & formatting.
              </div>
              <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <strong>Dark Mode</strong>: Built-in `dark` prop support.
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/2 flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <span class="font-semibold">Interactive Demo</span>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="isVertical" type="checkbox" class="rounded" />
                Vertical Layout
              </label>
            </div>
            <hex-color-picker
              v-model="hexColor"
              show-eyedropper
              :presets="presets"
              show-alpha
              show-input
              color-label="HEX"
              :dark="isDark"
              :vertical="isVertical"
              class="main-picker"
            />
          </div>
        </div>
      </section>

      <!-- Specialized Pickers Grid -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(picker, index) in [
            { name: 'RGB', model: rgbColor, comp: RgbColorPicker, alpha: true },
            { name: 'HSV', model: hsvColor, comp: HsvColorPicker, alpha: false },
            { name: 'HSL', model: hslColor, comp: HslColorPicker, alpha: false },
            { name: 'CMYK', model: cmykColor, comp: CmykColorPicker, alpha: false },
          ]"
          :key="index"
          class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg"
        >
          <h3 class="text-lg font-bold mb-4">{{ picker.name }}</h3>
          <component
            :is="picker.comp"
            v-model="picker.model"
            :show-alpha="picker.alpha"
            :dark="isDark"
          />
          <div class="mt-4 flex items-center justify-between text-xs font-mono opacity-70">
            <span class="truncate">{{ picker.model }}</span>
          </div>
        </div>
      </section>

      <!-- Custom Slots Demo -->
      <section
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20"
      >
        <h2 class="text-3xl font-bold flex items-center gap-3 mb-8">
          <span class="w-2 h-10 bg-pink-500 rounded-full"></span>
          Slot Customization
        </h2>
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="flex-1 space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              Override any part of the picker with your own Vue components. In this example, we use
              slots to create square handles and a unique crosshair saturation pointer.
            </p>
            <ul class="list-disc list-inside text-sm space-y-2 opacity-80">
              <li>
                Square handles using <code>#hue-pointer</code> and <code>#alpha-pointer</code>
              </li>
              <li>A custom <code>#saturation-pointer</code> with a crosshair look</li>
              <li>Total control over background via <code>#track</code> slots</li>
            </ul>
          </div>
          <div
            class="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-inner border border-black/5"
          >
            <hex-color-picker v-model="hexColor" :dark="isDark" show-alpha>
              <template #hue-pointer="{ left, top, color }">
                <div
                  class="absolute w-6 h-6 border-2 border-white shadow-md rounded-sm transform -translate-x-1/2 -translate-y-1/2"
                  :style="{ left: `${left * 100}%`, top: `${top * 100}%`, backgroundColor: color }"
                />
              </template>
              <template #alpha-pointer="{ left, top, color }">
                <div
                  class="absolute w-6 h-6 border-2 border-white shadow-md rounded-sm transform -translate-x-1/2 -translate-y-1/2"
                  :style="{ left: `${left * 100}%`, top: `${top * 100}%`, backgroundColor: color }"
                />
              </template>
              <template #saturation-pointer="{ left, top }">
                <div
                  class="absolute w-6 h-6 border-2 border-black rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  :style="{ left: `${left * 100}%`, top: `${top * 100}%` }"
                >
                  <div class="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                </div>
              </template>
            </hex-color-picker>
          </div>
        </div>
      </section>

      <!-- Theming Demo -->
      <section
        class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div class="flex-1 space-y-4">
            <h2 class="text-3xl font-bold">Infinite Theming</h2>
            <p class="text-indigo-100 text-lg">
              Every detail is customizable via CSS Variables. From dimensions to colors, you're in
              control.
            </p>
            <pre
              class="bg-black/20 p-4 rounded-xl text-xs font-mono border border-white/10"
            ><code>--vc-width: 280px;
--vc-border-radius: 24px;
--vc-accent-color: #f43f5e;</code></pre>
          </div>
          <div class="p-4 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
            <hex-color-picker
              v-model="hexColor"
              style="--vc-width: 240px; --vc-border-radius: 24px; --vc-accent-color: #f472b6"
              :dark="isDark"
            />
          </div>
        </div>
        <div
          class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"
        ></div>
      </section>
    </main>

    <footer class="mt-16 text-center text-gray-500 dark:text-gray-400 pb-12">
      <p>Supports keyboard navigation (Tab & Arrow keys) & Screen Readers</p>
      <p class="text-xs mt-2 opacity-50">Modernized with ❤️ by Antigravity</p>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom class for the main picker to showcase the layout flex */
.vue3-colorful {
  width: 100% !important;
  height: 250px !important;
  border-radius: 12px;
}

/* Ensure saturation area has space when in horizontal */
.main-picker.vue3-colorful--horizontal .vue3-colorful__saturation {
  min-width: 250px;
}
</style>
