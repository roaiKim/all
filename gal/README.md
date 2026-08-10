# GAL — 视觉小说/互动影游 编辑器 & 播放器

基于 **Tauri 2 + React 18 + TypeScript + Vite 5** 构建的桌面端视觉小说/真人互动影游创作工具。

灵感来源：《完蛋！我被美女包围了！》《完蛋！我被男同学包围了》等真人互动影游。

---

## 目录

- [项目定位](#项目定位)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [核心架构](#核心架构)
  - [1. 双入口设计](#1-双入口设计)
  - [2. 打包隔离策略](#2-打包隔离策略)
  - [3. 编辑器内预览机制](#3-编辑器内预览机制)
  - [4. 游戏引擎设计](#4-游戏引擎设计)
  - [5. 数据模型](#5-数据模型)
- [各模块详解](#各模块详解)
  - [共享层 `src/shared/`](#共享层-srcshared)
  - [播放器 `src/player/`](#播放器-srcplayer)
  - [编辑器 `src/editor/`](#编辑器-srceditor)
  - [Tauri 后端 `src-tauri/`](#tauri-后端-src-tauri)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [打包发布](#打包发布)
- [数据流图](#数据流图)

---

## 项目定位

**目标用户**：不懂编程的内容创作者（编剧、UP 主、独立游戏制作人）

**解决的问题**：
- 🎬 真人互动影游制作门槛高（需 Unity + C# 基础）
- 📝 剧本管理分散（视频、对话、分支散落各处）
- 🚀 预览麻烦（改一行 → 重新打包 → 才能看到效果）

**GAL 提供的方案**：
- 🖱️ **可视化编辑**：像做 PPT 一样做游戏，拖拽素材、填写表单、画流程图即可
- 👁️ **即时预览**：编辑器内一键预览，内存传输数据，秒级反馈
- 📦 **一键导出**：导出为独立桌面应用（仅含轻量播放器），双击即玩

---

## 技术栈

| 层级 | 技术 | 版本 | 选型原因 |
|------|------|------|----------|
| 桌面框架 | **Tauri** | 2.x | 打包体积 ~5-15MB（vs Electron 的 ~100MB+），调用系统 WebView |
| 后端语言 | **Rust** | 2021 edition | Tauri 强制要求；窗口管理、文件 I/O、IPC 均在此层 |
| 前端框架 | **React** | 18.x | 与项目现有技术栈一致 |
| 构建工具 | **Vite** | 5.x | 原生支持多页应用、HMR 极快、Tauri 官方推荐 |
| UI 组件库 | **Ant Design** | 5.x | 表单/列表/布局组件丰富，适合编辑器类工具 |
| 状态管理 | **Zustand** | 4.x | 轻量（~1KB），比 Redux 更适合编辑器场景 |
| 样式预处理 | **Less** | 4.x | 与项目其他子项目统一 |
| 包管理 | **Yarn** | 1.x | 同上 |

---

## 目录结构

```
gal/
│
├── 📄 package.json                 # 依赖 & 脚本
├── 📄 tsconfig.json                # TS 配置 (path aliases: @shared, @editor, @player)
├── 📄 tsconfig.node.json           # Vite 构建工具的 TS 配置
├── 📄 vite.config.ts               # ★ 双入口核心配置
├── 📄 index.html                   # 根入口 → 重定向至 /editor/
│
├── 🦀 src-tauri/                   # ═══ Tauri Rust 后端 ═══
│   ├── Cargo.toml                  # Rust 依赖声明
│   ├── build.rs                    # Tauri 构建脚本
│   ├── tauri.conf.json             # ★ Tauri 主配置（窗口/入口/打包）
│   ├── capabilities/
│   │   └── default.json            # 权限声明（窗口创建/文件读写/事件推送）
│   └── src/
│       ├── main.rs                 # 程序入口（Windows 隐藏控制台）
│       └── lib.rs                  # ★ 核心逻辑：5个 IPC 命令 + 数据结构
│
├── 🔗 src/shared/                  # ═══ 编辑器 & 播放器 共享层 ═══
│   ├── types/
│   │   ├── game.ts                 # ★ 核心数据模型（GameProject/Scene/Choice/Condition/Effect）
│   │   └── ipc.ts                  # IPC 通信类型签名（前端 ↔ Rust）
│   ├── constants/
│   │   └── defaults.ts             # 空项目模板 + Demo 示例项目 + 支持的文件格式
│   └── utils/
│       ├── validation.ts           # 项目完整性校验（循环引用/缺失场景/不可达检测）
│       └── broadcast.ts            # ★ BroadcastChannel 跨标签页通信（编辑器→播放器）
│
├── 🎮 src/player/                  # ═══ 播放器（打包时 ★保留★） ═══
│   ├── index.html                  # 播放器 HTML 入口
│   ├── main.tsx                    # React 挂载点
│   ├── App.tsx                     # ★ 播放器主容器（三数据源：Tauri IPC / BroadcastChannel / Demo）
│   ├── engine/
│   │   ├── GameEngine.ts           # ★ 核心游戏循环（状态机）
│   │   ├── ScriptParser.ts         # 剧本解析器（场景查找 + 热重载）
│   │   └── VideoManager.ts         # 视频播放管理器（预加载/缓存/音量控制）
│   ├── components/
│   │   ├── VideoPlayer.tsx         # 视频播放 + 实时字幕叠加
│   │   ├── ChoicePanel.tsx         # 分支选项面板（自动过滤条件不满足的选项）
│   │   ├── DialogueBox.tsx         # 打字机效果对话面板
│   │   ├── SaveLoadPanel.tsx       # 10 槽位存档/读档界面
│   │   └── SettingsPanel.tsx       # 音量/文字速度设置
│   └── styles/
│       └── player.less             # 全屏暗色游戏风格 UI
│
└── 🛠️ src/editor/                  # ═══ 编辑器（打包时 ★排除★） ═══
    ├── index.html                  # 编辑器 HTML 入口
    ├── main.tsx                    # React 挂载点 (antd ConfigProvider 暗色主题)
    ├── App.tsx                     # ★ 三栏布局主框架
    ├── stores/
    │   ├── projectStore.ts         # ★ 项目数据 store（场景/变量/素材 CRUD）
    │   └── editorStore.ts          # 编辑器 UI 状态 store（选中/面板/标签页）
    ├── components/
    │   ├── Toolbar/                # 顶部工具栏（新建/Demo/保存/预览/导出）
    │   ├── StoryFlow/              # 左侧场景列表面板
    │   ├── NodeEditor/             # 右侧场景属性编辑面板
    │   ├── ResourceManager/        # 素材管理面板（导入/分类/删除）
    │   ├── VariableEditor/         # 变量表格编辑器
    │   ├── PreviewPanel/           # 底部内嵌预览面板
    │   └── ExportDialog/           # 导出对话框
    └── styles/
        └── editor.less             # 暗色 IDE 风格编辑器 UI
```

---

## 核心架构

### 1. 双入口设计

项目通过 **Vite 多页应用** 配置实现编辑器与播放器的共存与分离：

```typescript
// vite.config.ts (关键代码)
export default defineConfig(({ mode }) => ({
  build: {
    rollupOptions: {
      input:
        mode === 'production'
          ? { player: 'src/player/index.html' }        // 生产：只打包播放器
          : {
              editor: 'src/editor/index.html',          // 开发：两者都打包
              player: 'src/player/index.html',
            },
    },
  },
}));
```

| 模式 | 打包内容 | 入口 | 使用场景 |
|------|----------|------|----------|
| `yarn dev` | editor + player | `editor/index.html` | 开发创作 |
| `yarn build` | 仅 player | `player/index.html` | 生产分发 |

### 2. 打包隔离策略

```
开发时 (yarn tauri dev)              生产时 (yarn tauri build)
┌─────────────────────┐              ┌─────────────────────┐
│  Tauri 窗口          │              │  Tauri 窗口          │
│  ┌───────────────┐   │              │  ┌───────────────┐   │
│  │ editor/       │   │              │  │ player/       │   │
│  │ (编辑器界面)   │   │              │  │ (游戏播放器)   │   │
│  └───────────────┘   │              │  └───────────────┘   │
│  可点击"预览"按钮     │              │  直接进入游戏        │
│  打开 Player 新窗口   │              │  无编辑器代码        │
└─────────────────────┘              └─────────────────────┘
```

关键配置：
- `tauri.conf.json` → `build.distDir: "../dist/player"` — 构建产物只用 player 目录
- `tauri.conf.json` → `build.devUrl: "http://localhost:1420/editor/index.html"` — 开发时打开编辑器
- `vite.config.ts` → 生产模式不编译 editor 入口 — 从源头排除

### 3. 编辑器内预览机制

编辑器点击"预览"按钮，按运行环境自动选择最优通道：

#### Tauri 桌面模式（`yarn tauri dev`）— 主要方式

启动时 Rust 自动创建两个原生窗口，都指向同一个 Vite dev server。编辑器点"预览"时走 IPC：

```
启动时:
  Rust setup() ─→ 创建 main 窗口 (editor)  +  player-dev 窗口 (player)

运行时:
  编辑器点击"预览"
      │  invoke('open_preview', {gameData})
      ▼
  Rust lib.rs::open_preview()
      │  emit("load-game-data", {data: gameData})
      ▼
  播放器窗口
      │  listen('load-game-data')
      │  GameEngine.start()
      ▼
  游戏开始运行
```
- 两个窗口各自独立 HMR
- 数据走 Rust IPC 内存通道，不写磁盘
- 播放器有完整的文件系统访问权限

#### 浏览器模式（`yarn dev`）— 无 Rust 时的备选

```
编辑器标签页                    播放器标签页
┌──────────────┐              ┌──────────────┐
│ 点击"预览"    │  BroadcastCh │ 接收数据      │
│ broadcast ───┼─────────────→│ 热加载引擎    │
│ Preview()    │   (内存)     │ 立即运行游戏  │
└──────────────┘              └──────────────┘
```
- 数据通过浏览器原生 `BroadcastChannel` API 跨标签页传递
- 不经过服务器、不写磁盘
- 播放器左上角显示 `📡 实时` 表示已连接编辑器

### 4. 游戏引擎设计

`GameEngine` 是一个 **纯状态机**（零 DOM 依赖），架构如下：

```
                    ┌──────────────┐
                    │   GameEngine │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
     ┌─────▼─────┐   ┌────▼────┐   ┌──────▼──────┐
     │  State    │   │Condition│   │   Effect    │
     │  Machine  │   │Evaluator│   │  Applier    │
     └─────┬─────┘   └────┬────┘   └──────┬──────┘
           │               │               │
     ┌─────▼─────┐         │               │
     │ Scene     │←────────┘               │
     │ Transition│                         │
     └─────┬─────┘                         │
           │                               │
     ┌─────▼─────┐                         │
     │ Variable  │←────────────────────────┘
     │ Store     │
     └───────────┘
```

**状态流转**：
```
IDLE → start() → PLAYING → advance() / selectChoice() → transitionTo()
                    ↑                                       │
                    │                                  ┌────▼────┐
                    │                             YES  │ Ending? │
                    └────────────────────────────────── │ scene?  │
                       restart()                  └────┬────┘
                                                       │ NO
                                                  ┌────▼────┐
                                                  │ Next    │
                                                  │ Scene   │
                                                  └─────────┘
```

**变量系统**：
```typescript
// 条件示例：只有好感度 > 50 才能进入告白场景
{
  conditions: [{
    variableId: 'affection',
    operator: 'gt',   // greater than
    value: 50
  }]
}

// 效果示例：选择"帮助他"后好感度 +10
{
  effects: [{
    variableId: 'affection',
    action: 'add',
    value: 10
  }]
}
```

### 5. 数据模型

核心数据结构（`src/shared/types/game.ts`）：

```
GameProject
├── meta:         项目元信息（标题/作者/分辨率/起始场景）
├── scenes[]:     场景数组
│   ├── id, name, type (video|dialogue|choice|branch|ending)
│   ├── videoSrc?:        视频文件路径
│   ├── subtitles?:       时间轴字幕 [{startTime, endTime, text}]
│   ├── dialogue?:        静态对话 [{speaker, text, avatar}]
│   ├── choices?:         分支选项 [{id, text, nextSceneId, conditions?, effects?}]
│   ├── nextSceneId?:     线性跳转目标
│   ├── conditions?:      进入此场景的前置条件
│   ├── effects?:         进入此场景后触发的效果
│   ├── bgm?:             背景音乐路径
│   └── background?:      背景图片路径
├── variables[]:   全局变量数组
│   └── id, name, key, type (number|boolean|string), defaultValue
└── assets:        素材清单
    ├── videos[]
    ├── images[]
    └── audios[]
        └── id, name, path, size, mimeType
```

---

## 各模块详解

### 共享层 `src/shared/`

#### `types/game.ts` — 核心数据模型

定义了游戏项目的所有数据结构。这套类型在：
- **编辑器** 中使用（读取/修改项目数据）
- **播放器** 中使用（解析/运行项目数据）
- **Rust 后端** 中镜像（`lib.rs` 中用 `#[derive(Serialize, Deserialize)]` 定义对应结构体）

所有类型均使用 `camelCase` 命名（与 JSON 序列化保持一致），Rust 端通过 `#[serde(rename_all = "camelCase")]` 对应。

#### `types/ipc.ts` — IPC 通信类型

定义了前端 ↔ Rust 后端的通信契约：

| 方向 | 方法 | 用途 |
|------|------|------|
| Renderer → Rust | `invoke('open_preview')` | 打开预览窗口 |
| Renderer → Rust | `invoke('save_project')` | 保存项目到磁盘 |
| Renderer → Rust | `invoke('export_game')` | 导出独立游戏包 |
| Renderer → Rust | `invoke('save_game')` | 写入存档 |
| Renderer → Rust | `invoke('load_game')` | 读取存档 |
| Rust → Renderer | `listen('load-game-data')` | 向播放器推送游戏数据 |

#### `constants/defaults.ts` — 默认值

- `createEmptyProject()` — 新建空白项目
- `createDemoProject()` — 内置 Demo 项目（4个场景：开场→教室/操场→放学）
- `SUPPORTED_ASSETS` — 支持的素材格式（视频 mp4/webm/mov、图片 png/jpg/gif/webp、音频 mp3/wav/ogg）

#### `utils/validation.ts` — 校验器

- `validateProject()` — 完整校验，返回所有错误（标题为空/起始场景不存在/跳转目标缺失/结局不应有后续）
- `findReachableScenes()` — BFS 遍历所有从起始场景可达的场景
- `isProjectValid()` — 快速检查是否有阻塞级错误

---

### 播放器 `src/player/`

#### `engine/GameEngine.ts` — 核心游戏循环

**职责**：
1. **状态管理**：维护 `currentSceneId`、`variables`、`history`、`isPlaying`、`isPaused`
2. **场景流转**：`start()` → `advance()` → `transitionTo()` → `emit()`
3. **条件评估**：根据当前变量值判断条件是否满足
4. **效果应用**：执行 `set`/`add`/`toggle` 操作修改变量
5. **存档系统**：`createSaveData()` / `loadFromSave()` / `persistSave()`

**设计原则**：
- ❌ 不依赖 React / DOM — 纯 TypeScript 状态机
- ❌ 不直接操作 UI — 通过 `subscribe(listener)` 通知视图更新
- ✅ 可被编辑器 `PreviewPanel` 直接复用

```typescript
// 使用示例
const engine = new GameEngine(project);
const unsub = engine.subscribe((state) => {
  // React setState here
});
engine.start();
// ... 用户交互 ...
engine.selectChoice('choice_1');
```

#### `engine/ScriptParser.ts` — 剧本解析器

轻量级的项目数据读取层，负责：
- 构建 `sceneId → Scene` 的索引 Map
- 提供场景查找、数量统计
- 支持 `reload()` 实现热重载（编辑器修改后预览即时生效）

#### `engine/VideoManager.ts` — 视频管理器

封装 HTML `<video>` 元素的操作：

| 功能 | 实现 |
|------|------|
| 播放/暂停 | `play()` / `pause()` / `resume()` |
| 跳转 | `seek(time)` |
| 音量 | `setVolume(0-1)` / `setMuted(bool)` |
| 预加载 | `preload(src)` — 创建隐藏 video 元素提前加载 |
| 事件 | `onEnded()` / `onTimeUpdate()` 回调 |
| 清理 | `destroy()` — 移除所有预加载元素、解绑事件 |

#### `App.tsx` — 三种数据入口

播放器启动时按优先级探测数据来源：

| 优先级 | 数据源 | 触发方式 | HUD 标识 |
|--------|--------|----------|----------|
| 1 | Tauri IPC | `yarn tauri dev` — 编辑器点击"预览" → Rust 开窗口 emit | `🖥️ 桌面` |
| 2 | BroadcastChannel | `yarn dev` 双标签页 — 编辑器点击"推送预览" | `📡 实时` |
| 3 | Demo 项目 | 独立打开播放器标签页，500ms 后自动降级 | `📦 Demo` |

> **启动逻辑**：先尝试 import `@tauri-apps/api/event`（Tauri 环境），失败则注册 `BroadcastChannel` 监听器，同时设 500ms 超时——若超时前未收到 BC 数据，则自动加载 Demo。三种入口无需手动切换。

#### 组件说明

| 组件 | 功能 | 关键交互 |
|------|------|----------|
| `VideoPlayer` | 视频播放 + 字幕叠加 | 点击全屏，自动根据 `currentTime` 匹配字幕 |
| `ChoicePanel` | 选项面板 | 自动隐藏条件不满足的选项，选项有渐入动画 |
| `DialogueBox` | 对话面板 | 打字机效果(40ms/字)，点击跳过/继续，渐变背景 |
| `SaveLoadPanel` | 存档管理 | 10 槽位，存档/读档双模式，显示时间戳 |
| `SettingsPanel` | 游戏设置 | 主音量/BGM/音效 滑块，文字速度选择 |

---

### 编辑器 `src/editor/`

#### 布局结构 — 三栏式 IDE

```
┌─────────────────────────────────────────────────────┐
│  Toolbar (新建 | Demo | 保存* | 预览 | 导出)        │
├────────────┬──────────────────────┬─────────────────┤
│  Left      │                     │  Right          │
│  Sider     │   Canvas            │  Sider          │
│  280px     │   (未来：流程图)     │  320px          │
│            │                     │                 │
│ [场景列表] │   当前无选中场景     │  [场景属性]     │
│ [素材]     │   请从左侧选择       │   · 名称        │
│ [变量]     │                     │   · 类型        │
│            │                     │   · 对话编辑    │
│            │                     │   · 选项编辑    │
│            │                     │   · 跳转设置    │
├────────────┴──────────────────────┴─────────────────┤
│  Preview Panel (可折叠)                              │
│  [场景名] [对话内容] [选项按钮] [继续▶]              │
└─────────────────────────────────────────────────────┘
```

#### stores

| Store | 用途 | 核心 state |
|-------|------|------------|
| `projectStore` | 项目数据 CRUD | `project`, `isDirty`, `filePath`, `isDemo` |
| `editorStore` | 编辑器 UI 状态 | `selectedSceneId`, `selectedTab`, 面板开关 |

**projectStore 核心方法**：
- `newProject()` — 创建空白项目
- `loadDemo()` — 加载内置 Demo
- `addScene()` / `updateScene()` / `removeScene()` — 场景 CRUD
- `addVariable()` / `updateVariable()` / `removeVariable()` — 变量 CRUD
- `addAsset()` / `removeAsset()` — 素材管理
- `getValidationErrors()` — 校验当前项目
- `markClean()` — 标记已保存

#### 组件说明

| 组件 | 功能 | 降级方案（无 Tauri 时） |
|------|------|--------------------------|
| `Toolbar` | 新建/Demo/保存/预览/导出 | 保存→下载 JSON，预览→内嵌面板 |
| `StoryFlow` | 场景列表，增删，设起始场景 | 纯 React 操作，不依赖后端 |
| `NodeEditor` | 选中场景的属性编辑（对话/选项/跳转） | 纯前端表单 |
| `ResourceManager` | 素材导入、分类展示、删除 | 浏览器文件选择器 |
| `VariableEditor` | 变量表格（名称/类型/默认值） | 纯前端表格 |
| `PreviewPanel` | 底部内嵌预览，复用 GameEngine | 浏览器环境专用 |
| `ExportDialog` | 导出 JSON / 独立包 | JSON→下载，独立包→需 Tauri |

#### 降级策略

编辑器设计为 **三级降级**，确保在任何环境下都能工作：

| 环境 | 预览方式 | 保存方式 | 素材导入 | 存档 |
|------|----------|----------|----------|------|
| Tauri 桌面 | Rust 开新系统窗口 + IPC | Rust 写磁盘 | Rust 系统对话框 | App data dir |
| 浏览器（推荐） | BroadcastChannel 双标签页 | 下载 JSON 文件 | `<input type="file">` | localStorage |
| 浏览器（降级） | 底部内嵌 PreviewPanel | 下载 JSON 文件 | `<input type="file">` | localStorage |

---

### Tauri 后端 `src-tauri/`

#### `lib.rs` — 5 个 IPC 命令

| 命令 | 触发方式 | 功能 |
|------|----------|------|
| `open_preview` | 编辑器点击"预览" | 创建 Player 窗口，emit 游戏数据 |
| `save_project` | 编辑器点击"保存" | 将 GameProject 序列化为 JSON 写入磁盘 |
| `export_game` | 编辑器点击"导出" | 创建导出目录，写入 game.gal.json |
| `save_game` | 播放器存档 | 写入 app data dir 的 `save_{n}.json` |
| `load_game` | 播放器读档 | 读取并返回存档 JSON |

#### `tauri.conf.json` 关键配置

```json
{
  "build": {
    "beforeDevCommand": "yarn dev",            // 开发前启动 Vite
    "beforeBuildCommand": "yarn build",         // 打包前构建前端
    "devUrl": "http://localhost:1420/editor/index.html",  // ★ 开发→编辑器
    "distDir": "../dist/player"                 // ★ 打包→仅播放器
  }
}
```

#### `capabilities/default.json` 权限

```json
{
  "windows": ["main", "preview"],  // 两个窗口都获得权限
  "permissions": [
    "core:window:allow-create",           // 允许创建新窗口（预览用）
    "core:event:allow-emit",              // 允许 Rust 推送事件到前端
    "core:event:allow-listen",            // 允许前端监听 Rust 事件
    "dialog:allow-open",                  // 允许文件打开对话框
    "fs:allow-read-text-file",            // 允许读取文本文件
    "fs:allow-write-text-file",           // 允许写入文本文件
    "shell:default"                       // 允许 shell 操作
  ]
}
```

---

## 快速开始

### 前提条件

| 工具 | 用途 | 安装 |
|------|------|------|
| **Node.js** ≥ 18 | 前端运行时 | [nodejs.org](https://nodejs.org/) |
| **Yarn** ≥ 1.22 | 包管理 | `npm i -g yarn` |
| **Rust** (可选) | Tauri 桌面打包 | [rustup.rs](https://rustup.rs/) |

### 安装与运行

```bash
# 1. 进入项目目录
cd gal

# 2. 安装前端依赖
yarn install
```

#### 方式一：Tauri 桌面开发 ★ 推荐

启动后**自动打开两个桌面窗口**——编辑器 + 播放器并排，各自独立 HMR：

```bash
yarn tauri dev
```

```
┌──────────────────────┐   ┌──────────────────────┐
│  GAL Editor          │   │  GAL 播放器           │
│  (桌面原生窗口)       │   │  (桌面原生窗口)       │
│                      │   │                      │
│  场景列表  属性面板   │   │  等待编辑器推送数据   │
│  [预览] 按钮 ──── IPC ──→  实时运行游戏         │
│                      │   │                      │
│  HMR: 改编辑器代码    │   │  HMR: 改播放器代码    │
│  → 即时刷新          │   │  → 即时刷新          │
└──────────────────────┘   └──────────────────────┘
```

**工作流**：
1. `yarn tauri dev` — 两个窗口自动出现
2. 编辑器窗口：修改场景、编辑对话、配置选项
3. 点击「**预览**」→ 数据通过 Rust IPC 推送到播放器窗口
4. 播放器窗口立即运行游戏，所见即所得
5. 修改播放器代码（组件样式/引擎逻辑）→ 播放器窗口 HMR
6. 修改编辑器代码（表单/布局）→ 编辑器窗口 HMR

> **原理**：两个窗口都加载 Vite dev server 的页面，Tauri 只是提供了原生窗口壳。HMR 照常工作，同时还能用 Rust 的文件系统、系统对话框等原生能力。

#### 方式二：浏览器开发（无需 Rust）

如果你没有安装 Rust，可以用纯浏览器模式：

```bash
yarn dev
```

然后手动打开两个浏览器标签页：

| 标签页 | URL | 用途 |
|--------|-----|------|
| 编辑器 | `http://localhost:1420/editor/index.html` | 编辑场景、素材、变量 |
| 播放器 | `http://localhost:1420/player/index.html` | 接收编辑器推送，运行游戏 |

> 编辑器点「推送预览」→ 通过 `BroadcastChannel` 跨标签页传给播放器。功能与桌面模式一致，只是缺少文件系统等原生能力。

#### 方式三：打包为独立应用

```bash
yarn tauri build
# → 输出在 src-tauri/target/release/bundle/
# → 产物仅含播放器（~5-15MB），用户双击即玩，不含编辑器
```

### Rust 环境安装 (Windows)

```powershell
# 下载并运行 rustup-init.exe
# https://rustup.rs/

# 安装完成后，确保 Tauri 构建工具可用
cargo install tauri-cli --version "^2.0"
```

---

## 开发指南

### 添加新场景类型

1. 在 `src/shared/types/game.ts` 的 `SceneType` 中添加新类型
2. 在 `src/player/engine/GameEngine.ts` 的 `transitionTo()` 中添加处理逻辑
3. 在 `src/player/App.tsx` 的渲染条件中添加对应 UI
4. 在 `src/editor/components/NodeEditor/index.tsx` 的表单中添加配置项

### 添加新的变量操作符

1. 在 `src/shared/types/game.ts` 的 `ConditionOperator` 中添加
2. 在 `GameEngine.evaluateConditions()` 中添加 case
3. 在 `ChoicePanel.tsx` 的条件过滤中添加对应 case

### 添加新的 IPC 命令

1. 在 `src/shared/types/ipc.ts` 中定义 Payload 和 Result 类型
2. 在 `src-tauri/src/lib.rs` 中：
   - 添加对应的数据结构（`#[derive(Serialize, Deserialize)]`）
   - 实现 `#[tauri::command]` 函数
   - 注册到 `invoke_handler`
3. 在 `src-tauri/capabilities/default.json` 中添加必要权限
4. 在前端调用 `invoke('command_name', { payload })`

### 样式约定

- 编辑器使用 **Less** + **Ant Design 暗色主题**
- 播放器使用纯 **Less**，独立于 Antd（减小打包体积）
- 颜色规范：
  - 主色 `#6b8cff`（蓝紫）
  - 背景 `#141414`（编辑器）/ `#000`（播放器）
  - 面板背景 `#1a1a2e`
  - 文字 `rgba(255,255,255,0.85)`（主要）/ `rgba(255,255,255,0.45)`（次要）

---

## 打包发布

### 产物结构

```
gal-export/
├── game.gal.json          # 剧本数据文件
└── assets/                # 素材目录（视频/图片/音频）
    ├── videos/
    ├── images/
    └── audios/
```

### 构建产物体积预估

| 部分 | 大小 |
|------|------|
| Tauri 壳 (Rust) | ~3-5 MB |
| 前端 bundle (React + 组件) | ~100-200 KB |
| 素材 (视频/图片/音频) | 取决于项目 |
| **总计 (不含素材)** | **~5-15 MB** |

vs Electron 方案的 ~100MB+，**减少约 90%**。

### 发布平台

- **Steam**：将 `game.gal.json` + `assets/` + 播放器打包为独立应用上传
- **itch.io**：同上，支持直接上传 ZIP
- **Web**：Vite 构建后部署 `dist/player/` 到任意静态托管

---

## 数据流图

### 编辑器保存

```
用户点击保存
    │
    ▼
Editor Toolbar
    │  invoke('save_project', {gameData})
    ▼
Rust lib.rs::save_project()
    │  序列化为 JSON
    │  std::fs::write(path, json)
    ▼
磁盘: ./project.gal.json
```

### 预览 — Tauri IPC（`yarn tauri dev` ★）

启动时 Rust `.setup()` 自动创建两个原生窗口。编辑器点"预览"时：

```
用户点击预览
    │
    ▼
Editor Toolbar
    │  invoke('open_preview', {gameData})
    ▼
Rust lib.rs::open_preview()
    │  emit("load-game-data", {data: gameData}) → 已存在的 player-dev 窗口
    ▼
Player App.tsx
    │  listen('load-game-data')
    │  setProject(event.payload.data)
    ▼
GameEngine.start() → Player UI 渲染
```

### 预览 — BroadcastChannel（`yarn dev` 浏览器备选）

```
编辑器标签页                    播放器标签页
┌──────────────┐              ┌──────────────┐
│ 点击"预览"    │  BroadcastCh │ 接收数据      │
│ broadcast ───┼─────────────→│ 热加载引擎    │
│ Preview()    │   (内存)     │ 立即运行游戏  │
└──────────────┘              └──────────────┘
```

### 游戏运行

```
GameEngine.start()
    │
    ▼
加载 firstSceneId 对应场景
    │  评估 conditions
    │  应用 effects
    ▼
render 当前场景
    ├── video 场景 → VideoPlayer 播放
    │     └── 视频结束 → advance()
    ├── dialogue 场景 → DialogueBox 逐句展示
    │     └── 对话结束 → advance()
    ├── choice 场景 → ChoicePanel 展示选项
    │     └── 用户选择 → selectChoice() → transitionTo()
    └── ending 场景 → 显示"完" → 重新开始
```

---

## License

MIT

---

## 相关链接

- [Tauri 官方文档](https://v2.tauri.app/)
- [Vite 多页应用配置](https://vitejs.dev/guide/build.html#multi-page-app)
- [Zustand 官方文档](https://docs.pmnd.rs/zustand)
- [Ant Design 组件库](https://ant.design/)
- 灵感来源: [《完蛋！我被男同学包围了》Steam 页面](https://store.steampowered.com/)
