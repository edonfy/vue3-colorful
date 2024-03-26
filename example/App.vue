<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker, { VERSION } from '../dist/vue3-colorful'
import type { AnyColor } from '../dist/index.d.ts'

const color = ref<any>('')

</script>

<template>
  <color-picker v-model="color" />
  <ColorPicker class="mt-5" v-model="color"></ColorPicker>
  <div>
    color: {{ color }} {{ VERSION }}
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
