import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
// 导入路由鉴权
import './router/permission'

// 引入虚拟模块：UnoCSS 入口
import 'virtual:uno.css'
// 引入全局样式
import './styles/index.scss'

/**
 * 初始化 Vue 应用入口
 */
const app = createApp(App)

// 注册状态管理
app.use(createPinia())
// 注册路由
app.use(router)
// 注册 Element Plus，并配置中文语言包
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
