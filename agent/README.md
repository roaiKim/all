# app-roaikim

基于 **Rsbuild** + **Electron** + **React 19** 的桌面应用。

## 环境要求

- Node.js >= 18
- npm >= 9

## 安装

```bash
npm install
```

## 开发

启动开发环境（渲染进程 + Electron 主进程）：

```bash
npm start
```

此命令会：
1. `prestart` 将 `src/electron/` 下的主进程 TS 编译为 JS（`release/app/dist/`）
2. `start:renderer` 启动 Rsbuild dev server（端口 10010）
3. `start:electron` 启动 Electron 窗口，加载 dev server

## 构建

构建渲染进程（Rsbuild）：

```bash
npm run build
```

## 打包

编译主进程并构建渲染进程：

```bash
npm run build:all
```

打包为当前平台可执行文件：

```bash
npm run package
```

按平台打包：

```bash
npm run package:win     # Windows（NSIS 安装包）
npm run package:mac     # macOS（DMG）
npm run package:linux   # Linux（AppImage）
```

打包产物输出到 `release/build/`。

## 命令速查

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发环境（dev server + Electron） |
| `npm run build` | 仅构建渲染进程 |
| `npm run build:main` | 编译 Electron 主进程 TS |
| `npm run build:renderer` | 构建 React 渲染进程 |
| `npm run build:all` | 编译主进程 + 构建渲染进程 |
| `npm run package` | 打包当前平台 |
| `npm run package:win` | 打包 Windows |
| `npm run package:mac` | 打包 macOS |
| `npm run package:linux` | 打包 Linux |
| `npm run preview` | 本地预览生产构建 |
| `npm run module` | 运行模块模板生成器 |

## 项目结构

```
src/
  electron/         # Electron 主进程（TS → release/app/dist/）
    main.ts         # 主进程入口
    preload.ts      # 预加载脚本
    menu.ts         # 菜单构建
    util.ts         # 工具函数
  module/           # 功能模块
  http/             # HTTP 请求层
  service/          # API 服务
  config/           # 配置
release/
  app/              # electron-builder 打包源
    package.json    # 不包含 "type": "module" 的入口配置
  build/            # 打包产物输出
```

## 技术栈

- **构建**: Rsbuild
- **框架**: Electron 35 + React 19
- **状态管理**: Redux + 自研模块框架 (`core/`)
- **UI**: Ant Design 6
- **打包**: electron-builder
