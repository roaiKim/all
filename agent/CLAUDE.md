# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 命令

```bash
yarn start          # 开发服务器，端口 10010（也可用 npm start）
yarn build          # 生产构建
yarn preview        # 本地预览生产构建
yarn run module     # 运行模块模板生成器
```

当前未配置测试或 lint 脚本。

## 架构

这是一个使用 **Rsbuild**（非 webpack）构建的 React 19 + TypeScript 单页应用。它使用位于 `roaikim/` 中的自定义 Redux 模块框架（通过 tsconfig paths 别名为 `@core`）。

### 框架 (`roaikim/`)

该框架在 Redux + react-router 之上提供了一个基于类的模块系统：

- **`Module<RootState, ModuleName>`** (`roaikim/platform/Module.tsx`) — 所有功能模块的基类。每个模块具有：
  - 生命周期钩子：`onEnter`、`onDestroy`、`onLocationMatched`、`onTick`
  - `setState()` 使用 immer 进行不可变更新
  - `pushHistory()` 用于导航
- **`register(module)`** (`roaikim/module.ts`) — 注册模块：为每个公开方法自动创建 Redux action creator，并存入 `app.actionHandlers`。
- **`bootstrap(options)`** (`roaikim/platform/bootstrap.tsx`) — 初始化整个应用：Redux store、路由（通过 `redux-router-bridge`）、错误处理、空闲检测以及 React 根节点渲染。
- **装饰器** — `@Loading`、`@Interval`、`@Mutex`、`@Log`、`@RetryOnNetworkConnectionError`、`@SilentOnNetworkConnectionError`（来自 `roaikim/decorator/`）。这些装饰器包装模块方法；异步生命周期方法上必须使用 `@Loading("moduleName")` 来控制加载状态。

`core/` 目录是同一框架的旧版本 — `roaikim/` 是当前版本（别名为 `@core`）。

### 模块规范

每个功能模块位于 `src/module/<name>/` 下，结构如下：

```
module/<name>/
  index.ts        # 模块类（继承 Module），已注册并导出
  type.ts         # 状态接口，包含 `statement` 导出（ModuleStatement）
  component/
    index.tsx     # 通过 module.connect() 连接的 React 组件
    index.less    # 样式（Less）
```

`load-modules.ts` 在构建时使用 webpack 的 `require.context` 发现所有模块的 `type.ts` 文件。它从每个文件中提取 `statement`（一个包含 name、title、path、icon、component 的 `ModuleStatement`）来构建模块注册表。开发环境下模块名称必须匹配 `/^[a-z]+-?[a-z]+?$/`。

`RootState` (`src/type/rootState.ts`) 必须为每个模块在 `app` 属性中声明一个带类型的条目（例如 `app: { main: MainState; login: LoginState; ... }`）。

### 路由

路由使用 `react-router` v7 配合 `redux-router-bridge`（history 同步到 Redux store）。`Module` 基类提供 `pushHistory()`，与模块生命周期集成。模块键与 URL 之间的路径映射位于 `src/utils/framework/path-mapping.ts`。

### HTTP 层 (`src/http/`)

- `network.ts` — 封装 axios，使用全局拦截器：
  - 解包成功响应（`response.data.data`），期望 `{ success, code, data }` 格式
  - 失败时抛出 `APIException` 或 `NetworkConnectionException`（来自 `@core`）
  - 自动附加 `Authorization` 头和 `Comma-Tenant-Id`
- `tools.ts` — URL 拼接和认证 token 工具

### 重要 tsconfig 路径

| 别名 | 路径 |
|---|---|
| `@core` | `../roaikim` |
| `@http` | `./http` |
| `@icon` | `../node_modules/@ant-design/icons` |
| `@project/*` | `../project/*` |
| `@api/*` | `./service/api/*` |

### 样式

使用 Less，通过 rsbuild 的 `modifyVars` 注入自定义前缀变量（`less-name: "mamba"`）。所有 Less 文件通过 `@less-name` 访问。JS 中使用 `src/utils/framework/` 中的 `joinLessPrefix()` 工具函数构建带前缀的类名。CSS 前缀最近已更改为 `mamba`（详见 git 历史）。

### 应用启动流程

1. `src/index.tsx` 调用 `@core` 中的 `bootstrap()`
2. `load-modules.ts` 通过 `require.context` 发现所有模块
3. `MainModule.onEnter()` 执行 — 检查 auth token，获取用户/权限信息
4. 认证失败则重定向到 `/login`；成功则渲染主布局
5. 项目配置 (`project/config.ts`) 控制在开发环境是否跳过登录 (`shouldIgnoreLogin`)
