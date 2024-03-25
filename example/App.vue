<script setup lang="ts">
import Pointer from '../src/components/Pointer'
import Saturation from '../src/components/Saturation'
import ColorPicker from '../src/components/ColorPicker'
import Hue from '../src/components/Hue'
import Alpha from '../src/components/Alpha'
import Interactive from '../src/components/Interactive'

defineProps<{
  testDun: (t: number) => void
}>()
</script>

<template>
  <div class="h-50px bg-sky relative">
    <Pointer :left="0.2" color="red"></Pointer>
  </div>

  <ColorPicker>
  </ColorPicker>


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
