import type { App } from 'vue'
import { version } from '../package.json'

//@ts-expect-error
const install = (app: App) => {
  console.log('hello')
}

export default {
  version,
  install,
}