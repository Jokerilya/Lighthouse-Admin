# Lighthouse Admin - 现代化后台管理系统

Lighthouse Admin 是一款基于 **Vue3 + Vite + TypeScript** 生态构建的高颜值、全功能个人管理后台。项目采用了极其精简的原子化设计理念，并完整实现了从底层架构封装到业务功能开发的闭环流程。

## 🛠️ 技术栈
- **核心框架**: Vue 3 (Script Setup) + TypeScript
- **构建工具**: Vite 
- **状态管理**: Pinia (有状态的模块化存储)
- **UI 组件库**: Element Plus (定制化主题)
- **样式引擎**: UnoCSS (原子化 CSS + 自动图标集成)
- **数据模拟**: Mock.js (内存级有状态后端模拟)
- **实用插件**: VueDraggablePlus (拖拽排序), ECharts (数据大屏), Md-Editor-V3 (Markdown 编辑), VueUse (工具库), Rollup-Plugin-Visualizer (打包分析)

## ✨ 核心特性

### 1. 响应式系统架构
- **Axios 二次封装**: 统一处理请求响应拦截、Token 自动注入、401 权限失效自动跳转及全屏 Loading 状态。
- **动态权限路由**: 结合全局守卫实现的路由鉴权，支持白名单访问。
- **UnoCSS 图标集**: 采用 `i-ep-*` 图标方案，无需手动引入组件即可在模板中直接使用数千种图标。
- **全局暗黑模式 (Global Dark Mode)**: 
  - 基于 CSS 变量体系的深度适配，支持按钮一键切换系统主题色。
  - 同步适配 ECharts 图表、Md-Editor 及所有 Element Plus 组件。

### 2. 业务功能模块
- **登录鉴权**: 模拟真实的 Token 验证流程与用户信息获取。
- **侧边栏导航**: 支持三级菜单递归渲染、折叠动画及响应式布局切换。
- **用户管理 (CRUD)**: 
  - 封装了 **`useTable` 通用 Hook**，将复杂的搜索、分页、加载逻辑高度抽象。
  - 实现了用户的新增、编辑、删除及批量删除功能。
- **任务清单 (Todo List)**: 
  - 支持 **拖拽排序** 功能，任务优先级色彩区分。
  - 状态即时同步至模拟后端。
- **个人周报 (Notebook)**: 
  - 采用 **Markdown 编辑预览一站式** 布局。
  - 实现了左侧历史列表+右侧编辑器的双栏管理模式，支持自动标题推导。
- **数据大盘 (Dashboard)**: 
  - 集成 ECharts 折线图展示任务趋势。
  - 采用 **骨架屏 (Skeleton)** 优化首屏加载体验。
  - 完美适配侧边栏折叠导致的图表伸缩问题 (Resize Observer)。
- **理财看板 (Finance Dashboard)**: 
  - 实现了资产登记、资产配比饼图及收益率曲线展示。
  - 深度适配暗黑模式，图表颜色随系统主题无缝切换。
- **全局搜索 (Spotlight)**: 
  - 支持 `Ctrl + Shift + K` 呼出搜索中心。
  - 集成菜单拼音/名称搜索，实现任意模块秒级直达。

## 📁 目录结构
```text
src/
├── api/          # 接口定义 (Axios 实例化调用)
├── hooks/        # 自定义 Hook 封装 (useTable 等)
├── layout/       # 系统主体布局组件
├── mock/         # Mock.js 模拟数据中心 (含内存持久化逻辑)
├── router/       # 路由配置与权限守卫
├── store/        # Pinia 状态树 (User, App)
├── styles/       # 全局样式与变量覆盖
├── utils/        # 工具函数 (Axios 封装等)
└── views/        # 业务页面列表
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

---

## 📝 开发备注
1. **Mock 数据**: 接口模拟位于 `src/mock` 目录下，采用全局变量实现进程内的增删改持久化。
2. **样式控制**: 页面样式优先使用 UnoCSS 编写，个性化样式定义在 `src/styles/index.scss` 或组件 `scoped` 块中。
3. **类型安全**: 项目强制开启严格 TS 检查，所有接口请求均推荐通过 Interface 定义数据结构。
4. **包体积分析**: 运行 build 后会自动生成 `stats.html` 文件，用于可视化分析前端依赖体积。
