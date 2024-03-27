<script setup lang="ts">
import { CSSProperties, computed, ref } from 'vue'
// import ColorPicker, { VERSION } from '../dist/vue3-colorful'

const color = ref<any>('')
const color2 = ref<any>('')
const testStyle = computed<CSSProperties>(() => ({
  backgroundColor: color.value
}))
</script>

<template>
  <div class="flex">
    <color-picker v-model="color" />
    <div class="flex ml-5">
      <div class="mr-2">
        color: {{ color }}
      </div>
      <div class="w-20px h-20px border-1 border-solid border-gray" :style="testStyle"></div>
    </div>
  </div>


  <div class="flex mt-5">
    <color-picker v-model="color2" color-model="rgb" :show-alpha="true" />
    <div class="ml-4">{{ color2 }}</div>
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
