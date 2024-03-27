import { createApp } from 'vue'
import App from './App.vue'

import 'virtual:uno.css'

// import ColorPicker from '../dist/vue3-colorful'
// import '../dist/style.css'

// import ColorPicker from '../src/color-picker'
// import '../src/style.css'

const app = createApp(App)

// app.component('color-picker', ColorPicker)

app.mount('#app')