/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'
import 'ant-design-vue/dist/reset.css'

// import '@/mock'
import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'
import { setupNaiveDiscreteApi } from './utils'
// process.env.NODE_ENV === 'production' && import('/mock/api/prodService')
import { renderTooltip } from '~/src/utils'

async function setupApp() {
  const app = createApp(App)

  setupStore(app)
  setupNaiveDiscreteApi()

  await setupRouter(app)

  /* 给所有的n-select使用renderOption属性 */
  app.config.globalProperties.$renderTooltip = renderTooltip

  app.mount('#app')
}

setupApp()
