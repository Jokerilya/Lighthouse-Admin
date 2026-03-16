import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'

/**
 * UnoCSS 配置文件
 * 参考文档: https://unocss.dev/
 */
export default defineConfig({
  // 预设配置
  presets: [
    presetUno(), // 默认 UnoCSS 预设
    presetIcons({
      // 图标前缀
      prefix: 'i-',
      extraProperties: {
         'display': 'inline-block',
         'vertical-align': 'middle',
      },
      // 会自动根据 i-ep-* 找到 @iconify-json/ep 包
    }),
  ],
  // 快捷键配置
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'full-page': 'min-h-screen w-full bg-[#f5f7f9]',
  },
  // 这里的图标类名如果写在 Element Plus 的 icon 属性里，UnoCSS 可能扫描不到
  // 强制将它们加入安全列表
  safelist: [
    'i-ep-search',
    'i-ep-refresh',
    'i-ep-plus',
    'i-ep-delete',
    'i-ep-edit',
    'i-ep-monitor',
    'i-ep-user',
    'i-ep-setting',
    'i-ep-warning',
    'i-ep-rank',
    'i-ep-notebook',
    'i-ep-check'
  ],
  // 主题变量
  theme: {
    colors: {
      primary: '#409EFF',
    }
  }
})
