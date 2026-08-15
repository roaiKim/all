# agent-electron

基于 [app-roaikim](../app-roaikim) 模板封装的 **Electron** 桌面应用。渲染层为 React 19 + TypeScript + Rsbuild，配合自研的 Redux 模块框架（`roaikim/`，tsconfig 别名 `@core`）。主进程（后台逻辑）用 TypeScript 编写、esbuild 编译。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 桌面外壳 | Electron（主进程 + 预加载，TypeScript 编写） |
| 构建 | Rsbuild（渲染层）+ esbuild（主进程编译） |
| 渲染层 | React 19 + Redux + react-router v7 |
| 框架 | 自研模块框架 `roaikim/`（基于类的 `Module` 系统） |
| 打包 | electron-builder |
| 包管理 | yarn 1.x |

## 环境要求

- Node.js 20+
- yarn 1.x

## 安装依赖

```bash
yarn install
```

> 项目根目录的 `.npmrc` 已配置 npmmirror 镜像，用于加速 Electron / electron-builder / esbuild 二进制下载。若网络可直连 GitHub，可删除该文件。

---

## Scripts 详解

### `yarn dev:all` — 开发模式（Electron 窗口）

```bash
yarn dev:all
```

实际执行：`concurrently -k "npm run start" "npm run dev:main" "npm run dev:electron"`

- 并行启动「渲染层 dev server」「主进程 esbuild watch」「Electron 主进程」三个子任务。
- `-k` 表示任意一个进程退出时，自动终止其余进程（关掉 Electron 窗口即整体退出）。
- dev server 监听 `10010` 端口；Electron 窗口会自动打开 DevTools。
- 开发期接口请求走 Rsbuild proxy 转发（见 `src/config/development.proxy.ts`）。

### `yarn start` — 仅渲染层 dev server

```bash
yarn start
```

实际执行：`rsbuild dev`

只启动 Rsbuild dev server，不拉起 Electron。适合只想在浏览器里调试渲染层，访问 <http://localhost:10010>。

### `yarn dev:main` — 仅主进程 watch 编译

```bash
yarn dev:main
```

实际执行：`node electron/build.mjs --watch`

用 esbuild 监听 `electron/**/*.ts`，改动即重新编译到 `dist-electron/`。仅重编译产物，不会重启 Electron 窗口。

### `yarn dev:electron` — 仅 Electron 主进程

```bash
yarn dev:electron
```

实际执行：`wait-on tcp:10010 dist-electron/main.cjs dist-electron/preload.cjs && cross-env ELECTRON_START_URL=http://localhost:10010 electron .`

- 先用 `wait-on` 等待 dev server 端口 `10010` 和主进程编译产物 `dist-electron/*.cjs` 就绪，再启动 Electron。
- `ELECTRON_START_URL` 让主进程加载 dev server 而非 `dist/`。
- 一般由 `yarn dev:all` 自动组合调用，**单独运行前需先启动 dev server 和主进程编译**（否则会一直等待）。

### `yarn build` — 生产构建（渲染层 + 主进程）

```bash
yarn build
```

实际执行：`rsbuild build && node electron/build.mjs`

- 渲染层打包到 `dist/`，使用相对路径（`assetPrefix: "./"`），可直接被 Electron 以 `file://` 协议加载。
- 主进程编译到 `dist-electron/`（`main.cjs` / `preload.cjs`）。
- 渲染层构建会生成 `dist/report-web.html` 与 `dist/stats.json` 供包体积分析。

### `yarn build:renderer` / `yarn build:electron` — 分开构建

```bash
yarn build:renderer   # 只构建渲染层 → dist/
yarn build:electron   # 只编译主进程 → dist-electron/
```

实际执行：`rsbuild build` / `node electron/build.mjs`

### `yarn dist` — 打包桌面安装包

```bash
yarn dist
```

实际执行：`rsbuild build && node electron/build.mjs && electron-builder`

先构建渲染层与主进程，再用 electron-builder 按 `package.json` 的 `build` 字段打包，产物输出到 `release/`：

| 平台 | 格式 |
| --- | --- |
| Windows | `nsis`（`.exe` 安装包，默认 x64，支持自定义安装目录） |
| macOS | `dmg` |
| Linux | `AppImage` |

首次运行会额外下载 NSIS / winCodeSign 等打包工具（约几百 MB，已走 npmmirror 镜像）。

### `yarn preview` — 预览生产构建（浏览器）

```bash
yarn preview
```

实际执行：`rsbuild preview`

在本地起静态服务器预览 `dist/` 产物，用于浏览器侧验证生产构建结果（非 Electron 环境）。

### `yarn module <name>` — 生成模块脚手架

```bash
yarn module home                # 一级模块
yarn module client/management   # 二级模块（最多两层）
```

实际执行：`node ./project/template/module.js <name>`

从 `project/template/module-boilerplate/` 复制模板到 `src/module/<name>/`，并自动完成：

1. 校验模块名（仅小写字母与中划线，例如 `home`、`client/management`；最多两层）。
2. 生成 `index.ts` / `type.ts` / `component/index.tsx` / `component/index.less`，替换占位符。
3. 自动更新 `src/type/rootState.ts`，插入该模块的 `import` 与 `app` 字段中的 State 条目。
4. 用 ESLint 对新生成文件做格式化。

> 若模块名不合法、模块已存在、或 rootState.ts 结构异常，脚本会报错并回滚已生成的目录。

---

## 后台逻辑（系统交互）

需要和系统打交道的逻辑（文件读写、对话框、剪贴板等）都放主进程 `electron/main/`，渲染层通过 IPC 调用。目前内置了文件读写能力：

```
前端:  electronFile.read("notes/a.txt")
        → window.electronAPI.file.read(...)          # preload.ts 暴露的白名单
        → ipcRenderer.invoke("file:read", path)
主进程: ipcMain.handle("file:read") → fileService.read(path)  # 真正 fs 读写
        → resolveUserPath() 校验（限制在 userData 目录内、阻止路径穿越）
```

前端用法（`src/service/electron.ts` 已封装好，类型安全）：

```ts
import { electronFile } from "service/electron";

const content = await electronFile.read("notes/hello.txt");   // 读
await electronFile.write("notes/hello.txt", "hello world");   // 写
const files = await electronFile.list("notes");               // 列目录
```

扩展方式：在 `electron/main/services/` 加业务逻辑 → `electron/main/ipc/` 注册对应通道 → `preload.ts` 暴露白名单 → `src/service/electron.ts` 加封装。

---

## 目录结构

```
electron/
  main.ts             # 主进程入口（启动编排：registerIpc + createWindow）
  preload.ts          # 预加载：通过 contextBridge 暴露 window.electronAPI 白名单
  build.mjs           # esbuild 构建脚本（bundle 成 CommonJS）
  tsconfig.json       # 主进程独立 tsconfig（IDE 类型 + tsc 检查）
  main/               # 后台逻辑主体（系统交互）
    config/           #   userData 路径 + 路径穿越校验
    utils/            #   统一错误包装 { ok } / { ok:false, code, message }
    services/         #   业务服务（fs 读写等，不依赖 electron）
    ipc/              #   IPC 通道注册（file:read / file:write / file:list）
    window/           #   窗口创建与管理
dist-electron/        # 主进程编译产物（main.cjs / preload.cjs，构建生成）
roaikim/              # 自研 Redux 模块框架（tsconfig 别名 @core）
core/                 # 框架旧版本（未使用）
project/              # 项目配置（config.ts）与模块模板（template/）
src/
  module/             # 业务模块（每个模块含 index.ts / type.ts / component/）
  components/         # 通用组件
  http/               # axios 封装、拦截器、URL/认证工具
  service/            # 服务层：global-api（HTTP API）、electron.ts（后台封装）
  config/             # dev proxy、静态常量（端口、前缀等）
  type/               # RootState 等全局类型
  utils/              # 框架工具（load-modules、path-mapping 等）
public/               # 静态资源与 HTML 模板（index.html、loading.html）
rsbuild.config.ts     # Rsbuild 配置（dev proxy、assetPrefix 等）
```

## 关键配置位置

| 配置项 | 文件 |
| --- | --- |
| dev server 端口 / proxy | `rsbuild.config.ts`、`src/config/development.proxy.ts` |
| 主进程入口 / 后台逻辑 | `electron/main.ts`、`electron/main/` |
| 主进程编译配置 | `electron/build.mjs`、`electron/tsconfig.json` |
| 打包（appId、安装包格式） | `package.json` 的 `build` 字段 |
| 路由 history 切换 | `roaikim/app.ts` |
| 免登录开关 | `project/config.ts`（`shouldIgnoreLogin`） |
| 前端后台封装 | `src/service/electron.ts` |

## 注意事项

- **路由**：Electron 生产环境使用 hash 路由（`roaikim/app.ts` 检测到 `file:` 协议时切换为 `createHashHistory`，URL 形如 `index.html#/home`）；浏览器中仍为 browser history。
- **主进程改动需重启**：`yarn dev:all` 下 esbuild watch 只重编译 `dist-electron/`，不会自动重启已打开的 Electron 窗口；改动 `electron/**/*.ts` 后需手动重启窗口。
- **后端 API**：`src/http/tools.ts` 的 `joinUrl` 返回 `/${host}${path}`。开发环境依赖 Rsbuild proxy 转发；**生产打包后无 proxy**，需配置真实 API 域名，否则接口会打到 `file://` 原点而失败。
- **镜像**：`.npmrc` 中的镜像面向无法直连 GitHub 的网络；若在可直连环境，删除该文件可避免走镜像。
