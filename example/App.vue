<script setup lang="ts">
import { CSSProperties, computed, ref } from 'vue'

import ColorPicker from '../dist/vue3-colorful'
import '../dist/style.css'

const hexColor = ref<string>('#ff6600')
const rgbColor = ref<string>('')
const hsvColor = ref<string>('')
const hslColor = ref<string>('')
const cmykColor = ref<string>('')

const testStyle = computed<CSSProperties>(() => ({
  backgroundColor: hexColor.value
}))
</script>

<template>
  <div>
    <h3>Hex (default)</h3>
    <div class="flex">
      <color-picker v-model="hexColor" />
      <div class="flex ml-5">
        <div class="mr-2">
          color: {{ hexColor }}
        </div>
        <div class="w-20px h-20px border-1 border-solid border-gray" :style="testStyle"></div>
      </div>
    </div>
  </div>

  <div class="mt-5">
    <h3>RGB with Alpha</h3>
    <div class="flex">
      <color-picker v-model="rgbColor" color-model="rgb" :show-alpha="true" />
      <div class="ml-4">{{ rgbColor }}</div>
    </div>
  </div>

  <div class="mt-5">
    <h3>HSV</h3>
    <div class="flex">
      <color-picker v-model="hsvColor" color-model="hsv" />
      <div class="ml-4">{{ hsvColor }}</div>
    </div>
  </div>

  <div class="mt-5">
    <h3>HSL</h3>
    <div class="flex">
      <color-picker v-model="hslColor" color-model="hsl" />
      <div class="ml-4">{{ hslColor }}</div>
    </div>
  </div>

  <div class="mt-5">
    <h3>CMYK</h3>
    <div class="flex">
      <color-picker v-model="cmykColor" color-model="cmyk" />
      <div class="ml-4">{{ cmykColor }}</div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
