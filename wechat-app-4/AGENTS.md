# AGENTS.md — wechat-app-4 开发指南

> 微信小程序项目（登录、任务、订单查询、个人中心）。
> 面向在本仓库写代码的 AI / 自动化代理与人类开发者。动手前请先读第 0、4、5、6、12 节。改完只检查本次改动的文件，不执行构建、不做全量检查。

---

## 0. 硬规则（TL;DR）

1. **只改 `src/`、`config/`、`types/`、`script/`**；不要手改 `dist/`、`node_modules/`、`tgz/`。
2. **所有内部模块必须走 `@` 前缀别名**（`@pages/...`、`@utils/...`），不要写 `pages/xxx`、`utils/xxx` 这类裸模块。
3. 别名只有两处定义：`config/index.ts` 的 `alias` 与 `tsconfig.json` 的 `paths`。**改一处必须同步另一处**。
4. 新页面必须注册到 `src/config/mini-config.ts` 的 `pages`；tabBar 页面还要出现在 `tabBar.list`。
5. 页面入口文件必须满足 `export default Main` 或 `export default module.connect(Main)`（`script/path.js` 靠这个特征识别页面）。
6. **接口调用只能写在 `src/service/public-api/*Service.ts` 的静态方法里**，页面/Module 里不要直接 `Taro.request`。
7. 新增 taro-ui 组件时，必须同步在 `src/asset/style/taro-ui.scss` 补对应组件样式，否则组件“能渲染但没样式”。
8. **不要动 `jsencrypt` 的版本**（锁死 `3.3.2`，原因见第 12 节）。
9. **改完不要执行 `build` / `dev` / 全量 `typecheck` / 全量 `lint`**；只对本次改动的文件做格式与类型检查（见第 9 节）。
10. **页面跳转必须使用 `roPushHistory`**（返回用 `roBackHistory`）；禁止直接调用 `Taro.navigateTo` / `redirectTo` / `switchTab` / `reLaunch` / `navigateBack`（`src/utils/functions/push-history.ts` 内部实现除外）。

---

## 1. 项目概览

| 项 | 值 |
| --- | --- |
| 项目 | 微信小程序，Taro 版 |
| 框架 | Taro **4.3.3** + React **18.3.1** + TypeScript **5.9** |
| 构建 | Vite **4.5.14**（`compiler: { type: "vite" }`） |
| 状态 | Redux 4 + react-redux 8 + 私有框架 `@core`（`wechat-core-app@1.0.7`，本地 tgz） |
| UI | taro-ui（实际解析 3.4.2）+ 自研组件 |
| 样式 | Less 为主 + taro-ui 的 SCSS（sass 1.108） |
| 设计稿 | **750**，构建期 px → rpx（不要手写 rpx/rem） |
| 目标平台 | 微信小程序（主）、H5（次） |

---

## 2. 安装与运行

```bash
yarn install          # 安装依赖
yarn dev:weapp        # 微信小程序 watch，产物输出到 dist/
```

打开微信开发者工具 → 导入项目 → 目录选择当前项目的 **`dist`** 文件夹。之后改动代码会自动重新编译。

其他常用命令（供开发者使用，AI 不主动执行）：

```bash
yarn build:weapp    # 生产构建 → dist/
yarn dev:h5         # H5 watch
yarn build:h5       # H5 构建 → dist/（可用 TARO_OUTPUT_ROOT=dist-h5 分目录）
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint 9（flat config）
yarn lint:fix
yarn stylelint      # 只检查 .less
yarn stylelint:fix
yarn module x/y     # 生成页面/模块骨架（推荐使用，不强制；见第 11 节）
yarn remove-module x/y  # 删除页面/模块（main/home/common 下不可删），并清理 RootState 与 mini-config（见第 11 节）
yarn auth           # 重新生成 src/type/auth-file.ts
yarn path           # 重新生成 src/type/paths.ts
```

- `TARO_OUTPUT_ROOT` 可改输出目录，例如 `TARO_OUTPUT_ROOT=dist-h5 yarn build:h5`。
- 每次 build 会自动生成打包分析报告：`dist/analyzer-weapp.html`（`config/analyze.ts`），不要提交。
- `build` 不做类型检查，类型问题由局部检查/编辑器负责。
- **AI 不要主动执行 `build:*` / `dev:*`**：构建与全量校验由开发者按需运行；AI 只做改动文件的局部检查（第 9 节）。

---

## 3. 目录结构与职责

```
wechat-app-4/
├─ config/                 # 构建配置（Taro + Vite）
│  ├─ index.ts             # 主配置：alias、图片产物名、sass、analyzer、outputRoot
│  ├─ dev.ts / prod.ts     # 环境差异
│  └─ analyze.ts           # rollup-plugin-visualizer 配置
├─ script/                 # 代码生成/扫描脚本（不参与打包）
│  ├─ module.js            # yarn module：复制模板生成页面，并改 RootState + mini-config
│  ├─ remove-module.js     # yarn remove-module：删除页面目录，并清理 RootState + mini-config
│  ├─ auth.js              # yarn auth：扫描 @verifiable 生成路由鉴权表
│  ├─ path.js              # yarn path：扫描页面入口生成 paths.ts
│  ├─ module-boilerplate/  # 页面模板
│  └─ tool/                # spawn 封装
├─ src/
│  ├─ app.tsx              # 应用入口：Provider + 全局壳 + bootstrap()
│  ├─ app.config.ts        # defineAppConfig(mini-config)
│  ├─ app.loading.tsx      # 全局 loading（useLoadingStatus + autoShowLoading）
│  ├─ app.less             # 全局样式（body）
│  ├─ index.html           # H5 入口模板
│  ├─ asset/
│  │  ├─ img/              # 所有图片（tab-bar/、home/、order/、global/、template/）
│  │  ├─ less/             # 全局 Less：index.less → global.less
│  │  └─ style/taro-ui.scss# taro-ui 按需样式聚合入口（唯一 scss）
│  ├─ component/           # 跨页面复用组件：Empty、nav-list、navbar、background
│  ├─ config/
│  │  ├─ mini-config.ts    # pages / tabBar / window（= app.json）
│  │  └─ static-envs.ts    # 环境判断、Storage key、loginPage 等常量
│  ├─ http/                # 请求层
│  │  ├─ index.ts          # 导出 ajax
│  │  ├─ network.ts        # ajax 实现：拼 URL、鉴权头、统一错误
│  │  ├─ static.ts         # host、ContentType、token/租户头、白名单
│  │  ├─ config.ts         # 各环境 baseApi
│  │  └─ interceptor.ts    # 备用 Taro 拦截器（当前未启用）
│  ├─ pages/               # 页面（见第 4 节）
│  │  ├─ home/             # tab 首页「任务」
│  │  ├─ order-search/     # 订单查询（模块拆分写法示例）
│  │  ├─ main/             # 全局壳（app.tsx 渲染），同时注册在 pages
│  │  └─ common/           # 公共业务页
│  │     ├─ login/         # wechat-login（登录入口）、password-login（账号密码）
│  │     ├─ change-password/
│  │     ├─ profile-center/# profile（tab「我的」）、user（个人信息）
│  │     └─ webview/
│  ├─ service/
│  │  ├─ public-api/       # 接口定义 + 调用（Login/Order/UserService）
│  │  └─ api-decorator.ts  # 空文件（未被引用）
│  ├─ type/                # 全局类型
│  │  ├─ state.ts          # RootState（所有 Module State 汇总）
│  │  ├─ global.ts         # 分页等通用接口结构
│  │  ├─ auth-file.ts      # 自动生成：路由鉴权表
│  │  └─ paths.ts          # 自动生成：页面路径表（当前未被引用）
│  └─ utils/
│     ├─ index.ts          # 对外工具出口（roPushHistory / roBackHistory）
│     ├─ bootstrap.ts      # 启动：注册全局错误处理
│     ├─ functions/        # autoShowLoading、delayToast、copyToClipboard、encrypted
│     ├─ decorator/        # withConfirm、verifiable、asyncActionHandler
│     ├─ error/            # captureError / setupGlobalErrorHandler
│     ├─ error-listener.ts # 全局错误 UI（401/403/404/400…）
│     ├─ events/           # roEvent 事件总线
│     ├─ ui/toast.tsx      # Toast.text / Toast.error
│     └─ service-register.ts # 服务注册（当前无引用）
└─ types/global.d.ts       # Taro/ImportMeta/ProcessEnv 全局声明
```

---

## 4. 页面与路由

### 4.1 目录约定

`src/pages` 下的每一个文件夹是一个页面，也是一个模块；每个模块有自己的 Redux State。

**新建页面/模块推荐使用 `yarn module <一级模块>/<页面名>`（不强制）**：它会按模板生成下面的目录结构，并自动把新模块写入 `RootState` 与 `mini-config`；手写目录同样可以，但需要保持相同的文件结构与职责。删除页面/模块用 `yarn remove-module <一级模块>/<页面名>`（见第 11 节）。

```
src/pages/<页面路径>/
├─ index.tsx          # 页面入口 + 数据模型层（Module、register、connect）
├─ index.config.ts    # definePageConfig：导航栏标题、custom 等
├─ type.ts            # 该模块的 State 类型及其他类型
└─ component/
   ├─ index.tsx       # 页面 UI（纯展示 + connect）
   └─ index.less      # 页面样式（类名前缀 ro-）
```

各文件职责：

| 文件 | 职责 |
| --- | --- |
| `component/index.tsx` | 具体页面 UI，只做渲染与事件，不直接请求接口 |
| `index.config.ts` | Taro 页面配置（标题、`navigationStyle` 等） |
| `index.tsx` | 页面入口 + 数据模型层：定义 Module（State、请求、跳转）、`register`、导出 actions，并 `export default module.connect(Main)` |
| `type.ts` | 该模块的 `State` 与业务类型 |

示例 `index.config.ts`：

```ts
export default definePageConfig({
    navigationBarTitleText: "账号登录",
    // navigationStyle: "custom", // 自定义导航栏时开启
});
```

### 4.2 三种页面写法

| 写法 | 入口 | 当前页面 |
| --- | --- | --- |
| **内联式（生成器默认，推荐）** | Module、`register`、`connect` 都写在 `index.tsx` | `home`、`main`、`profile-center/profile`、`profile-center/user`、新生成的页面 |
| 拆分式 | `index.tsx` + `index.module.ts` | `order-search` |
| 纯 UI（无 Module） | `export default Main` | 登录两页、change-password、webview |

`yarn module` 生成的页面入口（内联式）：

```ts
// pages/<模块>/index.tsx
import { Module, register } from "@core";
import { RootState } from "@type/state";
import Main from "./component";
import { State } from "./type";

const initialXxxState: State = {
    name: "xxx",
};

class XxxModule extends Module<RootState, "xxx"> {}

const module = register(new XxxModule("xxx", initialXxxState));
export const actions = module.getActions();

export default module.connect(Main);
```

数据请求、生命周期、跳转都写在这个 Module 里，例如：

```ts
class XxxModule extends Module<RootState, "xxx"> {
    onEnter(params) {
        this.fetchDetail(params.id);
    }

    @Loading()
    async fetchDetail(id: string) {
        const response = await XxxService.getDetail(id).catch((error) => {
            captureError(error);
            return Promise.reject();
        });
        this.setState({ detail: response });
    }
}
```

`order-search` 仍采用拆分式（`index.tsx` 只做 `module.connect(Main)`，Module 放在 `index.module.ts`），两种写法等价；新增页面按生成器默认的内联式写即可。

### 4.3 注册路由

编辑 `src/config/mini-config.ts`：

```ts
pages: [
    "pages/home/index",                 // 第一项 = 启动页
    "pages/common/login/wechat-login/index",
    // ...
],
tabBar: {
    list: [
        { pagePath: "pages/home/index", text: "任务", iconPath: "asset/img/tab-bar/home.png", selectedIconPath: "..." },
        { pagePath: "pages/common/profile-center/profile/index", text: "我的", ... },
    ],
},
```

规则：

- 注册到 `mini-config` 时路径不带前导 `/`、不带扩展名，源码必须在 `src/<path>.tsx`；而调用 `roPushHistory` 时路径要带前导 `/`（如 `/pages/home/index`）。
- **tabBar 页面必须在 `pages` 里**；`switchTab` 不能带参数。
- 原生 tabBar 没有 height 配置；要改高度只能 `custom: true` + `src/custom-tab-bar/`。
- **页面跳转统一用 `roPushHistory("/pages/xxx/index", params?, { redirection? })`**，参数会拼成 query；返回用 `roBackHistory(delta?)`。禁止直接调用 `Taro.navigateTo` / `redirectTo` / `switchTab` / `reLaunch` / `navigateBack`（`push-history.ts` 内部实现除外）。
- `roPushHistory` 内部按目标自动选择：tabBar 页面走 `switchTab`、普通页走 `navigateTo`、`redirection: true` 走 `redirectTo`；并会先做登录校验。
- 新增/删除页面后跑一次 `yarn path` 更新 `src/type/paths.ts`（当前未被业务引用）。

---

## 5. 状态管理（@core）

### 5.1 概念

```
register(new XxxModule(name, initialState))
   ├─ actions = module.getActions()          // action creator 集合
   └─ module.connect(Component)              // 页面 HOC：注入生命周期 + state
组件里：connect(mapStateToProps) + useDispatch()/roDispatch(actions.xxx(...))
非组件里：roDispatch(actions.xxx(...)) 或 this.dispatch(...)
```

- Module 名（`new XxxModule("home", ...)`）必须与 `RootState.app` 的 key 一致。
- `actions` 通过 redux dispatch 触发，实际执行的是 Module 上的同名方法（由 `@core` 的中间件绑定）。
- 页面组件取状态用 `connect(mapStateToProps)`；动作优先 `useDispatch()`（组件内）或 `roDispatch`（工具/其他模块）。

**为什么要有数据模型层**：把组件和数据隔离开。组件不应该关心数据怎么请求、状态放哪里；一个模块的所有请求动作集中在一处，便于维护和复用。

### 5.2 生命周期

| 方法 | 时机 | 说明 |
| --- | --- | --- |
| `onEnter(params, pageName)` | 页面首次进入 | 只执行一次，适合初始化请求；`params` 是 URL query 对象 |
| `onShow(params, pageName)` | 每次显示 | tab 切换/返回都会触发 |
| `onHide()` | 隐藏 | |
| `onDestroy(pageName)` | 卸载 | 默认清空该模块 State，可用 `@KeepState()` 保留 |
| `onTick()` | 定时循环 | 配合 `@Interval(seconds)` 使用（不设置时默认 5 秒）；上一次执行结束后才进入下一次，最多执行约 50 次，页面销毁也会停止 |

`pageName` 来自路由路径最后一段（如 `index` / `addition`）。

### 5.3 装饰器

| 装饰器 | 作用 | 说明 |
| --- | --- | --- |
| `@Loading(identifier?)` | 标记方法执行中，用于 loading | 只能修饰 `async` 函数；不传名称 = 全局 loading（由 `app.loading.tsx` 自动展示） |
| `@withConfirm(text?)` | 执行前二次确认 | 删除、退出等动作使用 |
| `@Mutex()` | 互斥锁，防重复点击 | 只能修饰 `async` 函数；上一次未结束时的调用会被忽略 |
| `@KeepState(keep?)` | `onDestroy` 时保留 State | `keep` 默认 `true` |
| `@Interval(seconds)` | 设置 `onTick` 的间隔 | 单位秒，配合 `onTick` 使用 |
| `@verifiable` | 标记「需要登录」 | 供 `yarn auth` 生成路由鉴权表 |

#### @Loading 用法

```ts
// 数据模型层
class HomeModule extends Module<RootState, "home"> {
    // 具名 loading，用于按钮等局部状态
    @Loading("saveButton")
    async save() {
        await saveApi();
    }

    // 不传名称 = 全局 loading
    @Loading()
    async fetchList() {
        const list = await listApi();
        this.setState({ list });
    }
}
```

组件里读取 loading 的两种方式：

```tsx
// 方式一：connect + showLoading
const mapStateToProps = (state: RootState) => ({
    saveLoading: showLoading(state, "saveButton"),
});
export default connect(mapStateToProps)(Home);
```

```tsx
// 方式二：useLoadingStatus
const saveLoading = useLoadingStatus("saveButton");
```

> 同名 loading 可跨页面复用；同一页面中不同按钮应使用不同名称。

#### @withConfirm

```ts
@withConfirm("确定删除吗？")
async remove() {
    await removeApi();
    this.setState({ list: [] });
}
```

组件里正常 `dispatch(actions.remove())`，会自动先弹确认框。

#### @Mutex

```ts
@Mutex()
async submit() {
    await submitApi();   // 连续点击只执行第一次
}
```

#### @KeepState / @Interval

```ts
@KeepState()
onDestroy() {}

@Interval(10)
onTick() {
    // 每 10 秒执行一次
}
```

### 5.4 RootState

新模块的 State 类型放页面 `type.ts`，并在 `src/type/state.ts` 注册；模块名必须与 key 一致：

```ts
export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        orderSearch: OrderSearchState;
        user?: UserState;
        profile?: ProfileState;
    };
}
```

`@core` 的根 State 结构：

```ts
export interface State {
    loading: LoadingState;
    navigationPrevented: boolean;
    app: object;
}
```

### 5.5 不要在组件里请求数据

组件只负责渲染与交互；数据请求放到对应页面的 Module 里。

```tsx
// 不推荐：组件内直接请求
useEffect(() => {
    fetchApi().then((res) => setData(res));
}, []);
```

```ts
// 推荐：请求写在 Module，状态通过 connect 注入
class HomeModule extends Module<RootState, "home"> {
    @Loading()
    async onEnter() {
        const data = await fetchApi();
        this.setState({ data });
    }
}
```

---

## 6. 接口层规范（重点）

### 6.1 三层结构

```
页面/Module  ──调用──▶  service/public-api/XxxService.ts  ──▶  http/network.ts ajax()
（状态/交互）            （接口定义 + 参数/返回类型）            （URL、鉴权、错误、解包）
```

### 6.2 接口定义写法

- 文件：`src/service/public-api/<领域>Service.ts`，导入别名 `@api/<领域>Service`。
- 类：`export class XxxService`，方法一律 `static`，返回 `Promise<Response>`。
- 类型：与接口同文件导出。**新接口统一用 `XxxService$方法名$Request/Response`**（`UserService` 是范本）。
- `LoginService` 采用 `XxxServiceMethodRequest/Response` 风格，两种命名并存时以 `$` 风格为准。
- 请求体参数、响应体字段必须写类型，禁止裸 `any`（`OrderService` 当前返回 `Promise<any>`，建议补全）。

```ts
// src/service/public-api/UserService.ts
import { ajax } from "@http";

export interface UserService$getUser$Response {
    id: string;
    name: string;
    phone: string;
    // ...
}

export class UserService {
    static getUser(id: string): Promise<UserService$getUser$Response> {
        return ajax("GET", "/driver/driverManagement/detail", { id }, "JSON");
    }

    static editProfile(request): Promise<void> {
        return ajax("PUT", "/client/personalCenter/edit", request, "JSON");
    }
}
```

### 6.3 `ajax` 签名与行为

```ts
ajax(method, path, request?, contentType = "JSON", ajaxConfig?: {
    headers?: Record<string, any>;   // 追加请求头
    config?: Record<string, any>;    // 透传 Taro.request
    globalHold?: boolean;            // false = 不抛错，直接返回原始 responseData
}): Promise<Response>
```

- `path` 不带 host：内部 `joinUrl` 拼成 `${host}/api${path}`；完整 `http(s)://` 地址会原样使用。
- 默认请求头：`Authorization`（Bearer token 或 Basic）、`Auth-Sub: MINI_APP`、`content-type`、`Comma-Tenant-id`。
- 约定响应：`{ code: 200, msg, data }`，**成功时 `ajax` 已解包，返回 `data`**。
- 异常：
  - HTTP 状态码 ≠ 200 → `APIException`（5xx 为 `NetworkConnectionException`）；
  - `code !== 200` → `APIException`；白名单 `auth/oauth/token` 与 `auth/oauth2/token?grant_type=social` 例外，原样返回。
- `contentType`：`"JSON"` / `"FORM"` / `"FORM_DATA"`。
- 环境：`src/http/config.ts` 的 `baseApi`（develop/trial/release），当前都指向 `http://192.168.2.46:31142/tms`；`getHost()` 按 `getAccountInfoSync().miniProgram.envVersion` 选择，H5 兜底 `develop`。

### 6.4 错误处理约定

- 业务里必须 `catch` 并调用 `captureError(error)`，否则不会进入全局错误 UI：

```ts
import { captureError } from "@core";

const res = await UserService.getUser(id).catch((error) => {
    captureError(error);
    return Promise.reject();
});
```

- 全局入口在 `src/utils/error/error-handler.ts`（`roApp.errorHandler` + `Taro.onError` + `Taro.onUnhandledRejection`），UI 在 `src/utils/error-listener.ts`：
  - 401/403 → 弹窗，确认跳登录页并清状态；
  - 404 → 提示资源不存在，可返回上一页；
  - 400 且 message 含“授权登录” → 跳登录；
  - 其他 `APIException` / `NetworkConnectionException` → 通用弹窗。
- **已知限制**：`@core` 的 `executeAction` 会吞掉生命周期方法（onEnter/onShow）里 `await` 的异常；这类错误既不会走全局，也不会 `captureError`。关键请求请在业务里显式 catch。
- 不需要全局报错时传 `{ globalHold: false }`，自行处理返回值。

### 6.5 环境与存储

- 环境判断/Storage key 全部从 `@config/static-envs` 取（`WEB_TOKEN`、`WEB_ISLOGIN`、`WEB_USER_INFO`、`WEB_COMMA_TENANT_ID`…），不要硬编码字符串。
- 登录页常量：`loginPage`；路由跳转先经 `validateAuth`（依赖 `src/type/auth-file.ts`）。
- 密码：登录页用 `@utils/functions/encrypted` 做 RSA 加密后再提交。

---

## 7. 样式规范

- 页面样式：`component/index.less`，根类名 `ro-xxx-page`；组件样式同目录 `index.less`，根类名 `ro-xxx-component`。
- **类名 kebab-case**（stylelint `selector-class-pattern`），不要 BEM 的 `block--modifier` 双横线（会被判错）。
- 单位直接用设计稿 px（750），构建转 rpx；不要写 rem、不要写 rpx。
- 全局样式：`src/asset/less/index.less`（引入 `global.less`），在 `app.tsx` 引入。
- taro-ui 样式：**只改 `src/asset/style/taro-ui.scss`**，按需引入；新增组件必须补对应 `components/<name>.scss`。全量 `index.scss` 会多出约 270KB。
- 常用色：主色 `#3579ff`、正文 `#1f2033`、分割线 `#e5e7eb`、占位 `#c8c8c8`。
- stylelint 只检查 `.less`；scss 不参与 stylelint。

---

## 8. 别名与导入顺序

| 别名 | 指向 | tsconfig |
| --- | --- | --- |
| `@core` | `node_modules/wechat-core-app` | `../node_modules/wechat-core-app` |
| `@http` | `src/http` | `./http` |
| `@api` | `src/service/public-api` | `./service/public-api/*` |
| `@pages` | `src/pages` | `./pages/*` |
| `@utils` | `src/utils` | `./utils`（含 `./utils/*`） |
| `@asset` | `src/asset` | `./asset/*` |
| `@type` | `src/type` | `./type/*` |
| `@config` | `src/config` | `./config/*` |
| `@component` | `src/component` | `./component/*` |
| `@service` | `src/service` | `./service/*` |

- 新增/调整别名时，**同时**修改 `config/index.ts` 和 `tsconfig.json`；改完用第 9 节的局部检查验证（临时 tsconfig + 改动文件 eslint），不执行 build。
- import 顺序由 ESLint `simple-import-sort` 自动整理：`react` → `react-*` → `@core` → 第三方包 → `@xxx` → 相对路径 → 图片/样式。
- 图片、样式也用别名：`import logo from "@asset/img/global/logo.png"`、`import "./index.less"`。

---

## 9. 代码风格与质量门禁

- **ESLint 9 flat config**（`eslint.config.mjs`），规则来自 `eslint-config-way@1.0.3`：
  - Prettier：4 空格、双引号、`printWidth: 150`、`trailingComma: es5`；
  - `@typescript-eslint/explicit-member-accessibility`：类成员需要显式修饰符（`public` 可省略，但 `private`/`protected` 必须写）；
  - `@typescript-eslint/no-unused-vars`：warn；
  - `no-console`：warn（仅允许 `error/info/table`）；
  - `no-undef` 对 TS 文件关闭（TS 负责）。
- **stylelint 14 + stylelint-config-way**（`stylelint.config.js`，standard 24 + postcss-less）。
- **TypeScript**：`strictNullChecks: false`、`noImplicitAny: false`、`skipLibCheck: true`、`module: esnext`、`baseUrl: ./src`。
- **只检查本次改动的文件**，不做全量检查：

```bash
# 格式与规则（只针对改动文件）
npx eslint src/pages/xxx/index.tsx src/service/public-api/XxxService.ts
npx stylelint src/pages/xxx/component/index.less

# 类型：用只 include 改动文件的临时 tsconfig（继承主配置）
cat > tsconfig.check.json <<'EOF'
{
  "extends": "./tsconfig.json",
  "include": ["src/pages/xxx/index.tsx", "types/global.d.ts"]
}
EOF
npx tsc --noEmit -p tsconfig.check.json
rm tsconfig.check.json
```

- **不要执行**：`yarn build:weapp`、`yarn build:h5`、`yarn dev:*`、`yarn typecheck`（全量）、`yarn lint`（全量）、`yarn stylelint`（全量）。构建与全量校验由开发者按需运行。
- 不要用 `npx tsc --noEmit src/xxx.tsx` 做单文件检查：它不会套用 `tsconfig` 的 `paths` 别名，会误报找不到模块；用上面的临时 tsconfig。

- 提交信息遵循 Conventional Commits（commitlint 已配置：`feat:` / `fix:` / `refactor:` …）。

---

## 10. 构建配置要点（`config/index.ts`）

- `outputRoot: process.env.TARO_OUTPUT_ROOT || "dist"`：weapp 与 h5 可分目录构建。
- `alias`：见第 8 节，与 tsconfig 同步。
- `mini.imageUrlLoaderOption / fontUrlLoaderOption / mediaUrlLoaderOption.name = toDistAssetPath`：统一图片/字体/媒体产物名为「相对 src 的正斜杠路径」，产物落在 `dist/asset/...`，与 tabBar `iconPath` 对应。
- `mini/h5.sassLoaderOption.silenceDeprecations`：静默 sass 的 `@import` / legacy API 警告；升级 sass 3 或 taro-ui 迁 `@use` 时需删除。
- `compiler.vitePlugins: [createAnalyzer()]`：每次构建生成 `dist/analyzer-<platform>.html`（`config/analyze.ts`）。
- `postcss.pxtransform`：750 设计稿 → rpx；`cssModules` 关闭。
- `project.config.json`：`miniprogramRoot: "./dist"`、`appid: "touristappid"`。

---

## 11. 新增功能 Checklist

### 新增页面

1. 推荐用 `yarn module <一级模块>/<页面名>`（不强制）生成 `index.tsx`、`index.config.ts`、`type.ts`、`component/index.tsx`、`component/index.less`；Module 内容直接写在 `index.tsx` 中（内联式）。手写目录时按第 4.1 节结构创建同样文件。
2. 把生成代码中的裸导入改为别名单：`type/state` → `@type/state`；`script/module.js` 写入 RootState 的 `pages/...` → `@pages/...`。
3. 在 `src/config/mini-config.ts` 的 `pages` 注册；tab 页再改 `tabBar.list`。
4. 需要登录态：给 Module 类加 `@verifiable`，并跑 `yarn auth`。
5. `yarn path` 更新路径表。
6. 页面间跳转用 `roPushHistory`，返回用 `roBackHistory`，不要直接调用 `Taro` 的跳转 API。
7. 只检查改动文件：`npx eslint <改动文件>`、`npx stylelint <改动的 less>`；类型用第 9 节的临时 tsconfig。不要执行 build。

### 删除页面/模块

1. 执行 `yarn remove-module <一级模块>/<页面名>`（或 `yarn remove-module <页面名>`）。
2. **`main`、`home`、`common/` 下的页面属于核心页面，不能通过命令删除**，脚本会直接报错；确需调整请手动处理并同步 `type/state.ts` 与 `mini-config.ts`。
3. 脚本会同步处理：
   - 删除 `src/pages/<模块>` 目录；
   - 删除 `src/type/state.ts` 中该模块的 State import 与 `RootState` 字段；
   - 删除 `src/config/mini-config.ts` 的 `pages` 路径，以及 `tabBar.list` 中指向该页面的项（若剩余不足 2 项会提示）。
4. 引用检查会把每个 import/require 解析成真实路径再判断：支持 `@pages/...`、`pages/...`、相对路径（`./`、`../`）以及 `"/pages/.../index"` 路由字符串；命中时列出文件并终止，确认要删时加 `--force`。
5. 删除后执行 `yarn path` 更新 `src/type/paths.ts`。

### 新增接口

1. 在 `src/service/public-api/<领域>Service.ts` 加 `static` 方法 + `Request/Response` 类型。
2. 页面 Module 里调用，`catch` 中 `captureError(error)`。
3. 状态写入 `this.setState(...)`；需要展示的字段在页面 `type.ts` 补类型。
4. 权限/租户相关 header 走 `ajaxConfig.headers`，不要绕过 `ajax`。

### 新增组件

1. `src/component/<Name>/index.tsx` + `index.less`，导出命名导出（如 `NavList`）或 default（如 `Empty`）。
2. 使用处 `import { NavList } from "@component/nav-list"` / `import Empty from "@component/Empty"`。
3. 若用到新的 taro-ui 组件，补 `src/asset/style/taro-ui.scss`。

---

## 12. 已知问题与坑（AI 必读）

| # | 问题 | 影响 / 规避 |
| --- | --- | --- |
| 1 | **jsencrypt 必须锁 3.3.2** | 3.4.0+ 的 `rng.js` 用 `self.crypto`；Taro 注入了 `window` 但没有 `self`，小程序启动即崩 `Cannot read properties of undefined (reading 'crypto')`。升级前必须先 polyfill `self`/`self.crypto`（建议用 `wx.getRandomValues`） |
| 2 | **生命周期异常被吞** | `@core` 的 `executeAction` 空 catch；`onEnter/onShow` 里 `await` 的接口报错不会进全局错误 UI。关键请求显式 `.catch(captureError)` |
| 3 | **`yarn auth` 正则写死 CRLF** | `script/auth.js` 用 `\r\n@verifiable\r\nclass` 匹配，LF 文件匹配不到 → `src/type/auth-file.ts` 恒为空 → `roPushHistory` 的登录校验实际不生效 |
| 4 | **生成器模板使用裸导入** | `script/module-boilerplate` 用 `type/state`；`script/module.js` 写 RootState 时用 `pages/...`。生成后必须手动改成 `@type`、`@pages` |
| 5 | **taro-ui 按需样式** | 新组件不补 `taro-ui.scss` 会“没样式”；全量引入会多 ~270KB wxss |
| 6 | **webview 页写死百度** | `src/pages/common/webview/component/index.tsx` 的 `src="https://www.baidu.com"`，上线前换真实地址并配业务域名 |
| 7 | **首页「预约下单」空实现** | `src/pages/home/component/index.tsx` 的 `onClick` 只有 `//` |
| 8 | **appid 为 touristappid** | `getPhoneNumber`、真机预览/上传受限；需要换真实已认证 appid |
| 9 | **死代码/空文件** | `src/utils/service-register.ts`（被 tree-shake）、`src/service/api-decorator.ts`（`export {}`）、`src/type/paths.ts`（生成但未引用） |
| 10 | **lint warning 基线 63 条** | 主要是 `console.log` 与未使用变量；新增代码不要增加 warning |
| 11 | **H5 下 taro-ui 尺寸** | taro-ui 的 px 不转 rpx，弹窗等固定宽度在 H5 会溢出；小程序端正常 |
| 12 | **`pages/main/index` 双重身份** | 既是全局壳组件（`app.tsx` 渲染），又注册在 `pages` 里；页面本体为空，勿当普通页面改 |
| 13 | **`order-search` 标题为「首页」** | `src/pages/order-search/index.config.ts` 的 `navigationBarTitleText` 疑似复制错误 |
| 14 | **`.husky` 缺失** | commitlint 配置在，但钩子文件不在；需要时 `yarn prepare` 重建 |

---

## 13. 给 AI 的行为约定

- 修改前先读相关文件与本文档；路径以 `src/pages` 下的实际目录为准，不要凭记忆猜。
- 不要新增裸模块导入；不要删除/重命名别名而不改 tsconfig。
- 不要引入新依赖而不确认版本兼容性（参考第 12 节 jsencrypt 版本约束）；引入前先看 `package.json` 是否已有等价能力。
- 不要改 `dist/`、`node_modules/`、`tgz/`；不要提交 `dist/analyzer-*.html`。
- 不要为了让编译通过而把类型改成 `any` 或关闭 lint 规则；确有必要时在说明里写清原因。
- 改完不要执行 `build` / `dev` / 全量 `typecheck` / 全量 `lint`；只对改动文件做格式与类型检查（第 9 节），并在回复里说明检查了哪些文件、结果如何。
- 页面跳转只使用 `roPushHistory` / `roBackHistory`，不直接调用 `Taro` 的跳转 API。
- 涉及 UI 的改动，说明预期效果；涉及接口的改动，说明请求路径、方法、参数与错误处理方式。
