import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 注入 UnoCSS
    UnoCSS(),
    // Mock 服务配置
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      // 设置路径别名 @ 指向 src 目录
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // 监听所有地址
    port: 3000,      // 设置开发服务器端口
    open: true,      // 启动时自动打开浏览器
  }
})
