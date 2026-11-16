# wechat-app → wechat-app-4 迁移说明

把 `../wechat-app`（Taro 3.4.13 + webpack）的业务代码整体迁移到 `wechat-app-4`（Taro 4.3.3 + Vite + React 18）。

## 一、目录与备份

原 `wechat-app-4` 是 `taro init` 生成的空模板，且整个目录属主为 `root`，普通用户无法写入。
迁移时把原目录整体改名保留为 **`../wechat-app-4.orig`**，再重建一个可写目录，业务代码从 `../wechat-app` 复制。

确认新项目无误后，可删除备份：

```bash
rm -rf /Users/rosen/hub/all/wechat-app-4.orig
```

## 二、技术栈变化

| 项 | 迁移前（wechat-app） | 迁移后（wechat-app-4） |
| --- | --- | --- |
| Taro | 3.4.13 | 4.3.3 |
| 构建器 | webpack 5（mini-runner） | Vite 4（vite-runner） |
| React | 17 | 18.3.1 |
| 状态 | react-redux 8 + redux 4 + `wechat-core-app` | 同左（升级 react 18 兼容） |
| UI | taro-ui 3.1.0-beta.7 | taro-ui 3.4.2 |
| 样式 | Less + taro-ui SCSS | 同左（sass 1.108） |
| 别名 | tsconfig baseUrl + @core/@http/@api | config.alias 显式声明（Vite 不认 baseUrl） |

## 三、代码改动清单

业务逻辑未重写，只处理 Taro 3 → 4 / webpack → Vite 的不兼容点：

| 文件 | 改动 | 原因 |
| --- | --- | --- |
| `config/index.ts` | 重写为 Taro 4 `defineConfig<'vite'>` | 原 config/index.js 使用 webpackChain / ForkTsChecker / ESLintPlugin，Taro 4 无这些能力 |
| `config/index.ts` | 新增 `alias`：`utils/pages/asset/type/config/component/service/http/@core/@http/@api` | 原代码用 `baseUrl: ./src` 写裸模块（`utils/xxx`、`asset/xxx`），Vite 不认 baseUrl |
| `config/index.ts` | 保留 `pxtransform`、`postcss.url(limit:1024)`、`designWidth:750` | 尺寸与图片内联行为对齐原项目 |
| `config/index.ts` | 新增 `outputRoot: process.env.TARO_OUTPUT_ROOT \|\| 'dist'` | 便于 weapp / h5 输出到不同目录 |
| `package.json` | 见上表依赖；新增 `typecheck` / `format` / `eslint-verify` 脚本 | 原项目脚本里有 eslint，模板里没有 |
| `package.json` | `browserslist` 由 Taro 4 模板的 env 对象改回原项目的数组写法 | env 对象与 `@vitejs/plugin-legacy` 冲突（`'development' is not a valid target`） |
| `package.json` | `resolutions` 强制 `wechat-core-app` 用 React 18 | 该包声明 react ^17，否则会装出第二份 React，Hooks/Redux 会崩 |
| `tsconfig.json` | `baseUrl: ./src` + 原 paths，`skipLibCheck: true`，`types: ["node"]`，`strictNullChecks: false`，`module: esnext` | 与原项目类型严格度保持一致；`@types/sass` 是空壳包会报 TS2688；`module: esnext` 用于允许 `import.meta` 语法 |
| `src/utils/service-register.ts` | `require.context` → `import.meta.glob("../service/public-api/**/*Service.ts", { eager: true })` | Vite 不支持 webpack 的 require.context；glob 会递归收集，新增 Service 无需改代码 |
| `src/pages/home/component/index.tsx`、`order-search/component/order-card/*` | 11 处 `require("asset/...")` → `import` | Vite 不解析运行时的 `require()` 资源引用 |
| `src/pages/order-search/component/v/index.tsx` | 删除（含其未被使用的 import） | 依赖 `@tarojs/components/virtual-list`，Taro 4.3.3 已不提供该入口，且组件从未被渲染 |
| `src/app.config.ts` | `as any as Taro.Config` → `as any` | Taro 4 `defineAppConfig` 接收 `AppConfig` |
| `src/index.html` | 补回 `<%= htmlWebpackPlugin.options.script %>`，并删除 wechat-app 自带的 rem 脚本 | 缺占位符时 H5 构建只产出空壳；rem 脚本 Taro 会自动注入一份，两份会按注入顺序互相覆盖，导致 H5 缩放不稳定 |
| `src/http/static.ts` | `getAccountInfoSync()` 加可选链与默认 env | H5 端无该 API，原代码在取 host 时抛 `Cannot read properties of undefined (reading 'envVersion')` |
| `types/global.d.ts` | 合并 TARO_ENV 联合类型 + TARO_APP_ID，并补 `ImportMeta.glob` 类型 | 模板只有前者，原项目只有后者；不引 `vite/client` 以免与 `*.png`/`*.less` 通配声明冲突 |
| `project.config.json` | appid 保持模板默认 `touristappid`（按要求不换成 wechat-app 的 appid） | 游客模式可本地预览；正式体验/发布需自行替换 appid，或改用 `.env.*` 的 `TARO_APP_ID` |

## 四、验证结果

```
yarn build:weapp   ✅ 10 个页面，2.5s，918KB
yarn build:h5      ✅ legacy 产物 + 全部分包
yarn dev:weapp     ✅ watch 模式可编译（已停止）
npx tsc --noEmit   ✅ 0 error
```

H5 产物用 headless Chrome 逐页验证（10 个页面路由中 8 个可直接访问，`user/addition`、`address/addition` 需登录态跳转）：

| 路由 | 渲染结果 |
| --- | --- |
| `pages/home/index` | ✅ 下单须知弹窗、预约下单/委托申请按钮、tabBar |
| `pages/login/index` | ✅ 华药冷链、账号登录、微信手机号登录 |
| `pages/login/password` | ✅ 账号 / 密码输入、登录按钮 |
| `pages/order-search/index` | ✅ 订单查询、订单号搜索、暂无订单 |
| `pages/profile-center/profile/index` | ✅ 个人信息、收货地址、退出登录 |
| `pages/profile-center/user/index` | ✅ 头像/电话/邮箱、修改密码 |
| `pages/profile-center/address/index` | ✅ 取件/派件地址、新建地址 |
| `pages/webview/index` | ✅ 委托申请 WebView 容器 |

装饰器（`@Loading()`、`withConfirm` 等）在产物中确认已正确编译（`Loading()` 调用 + `_applyDecoratedDescriptor` 等价实现），`@@framework/loading` 等 action 常量进入 bundle。

## 五、代码风格与 Lint（eslint-config-way / stylelint-config-way）

与 `agent-electron` 使用同一套共享配置，版本也对齐到它实际解析的结果：

| 工具 | 版本 | 配置入口 |
| --- | --- | --- |
| eslint | 9.39.5 | `eslint.config.mjs`（flat config，`import wayConfigs from "eslint-config-way"`） |
| eslint-config-way | 1.0.3 | 规则集本体（prettier 4 空格 / 150 列、simple-import-sort、react-hooks 等） |
| stylelint | 14.16.1 | `stylelint.config.js`（`extends: ["stylelint-config-way"]`） |
| stylelint-config-way | 1.0.0 | extends `stylelint-config-standard@24` + `customSyntax: postcss-less` |

- `eslint-config-way` 是 ESLint 9 flat config，因此移除了旧的 `eslint@8`、`eslint-config-taro`、`.eslintrc`。
- `stylelint-config-way` 基于 stylelint 14 + standard 24，故把 stylelint 从 16 降到 **14.16.1**（与 agent-electron 的 `yarn.lock` 解析结果一致），并补 `postcss-less@6`。
- 共享配置把 `globals` 写在 `parserOptions.globals`，这在 flat config 里**不生效**（应放 `languageOptions.globals`）。项目侧补了 `defineAppConfig` / `definePageConfig` / `wx` 全局，并对 TS 文件关闭 `no-undef`（类型检查已覆盖）。**建议回头修 `eslint-config-way` 本身**，否则在别的项目里 `console`/`process` 也会被误报。
- 新增脚本：`yarn lint` / `yarn lint:fix` / `yarn stylelint` / `yarn stylelint:fix`。
- 根目录 `.vscode/settings.json` 的 `eslint.workingDirectories` 已加入 `wechat-app-4`，配合已有的保存时自动修复。

为满足规则做的代码调整（大部分 `--fix` 自动完成）：

| 规则 | 数量 | 处理方式 |
| --- | --- | --- |
| `simple-import-sort/imports` | 22 | `--fix` 自动重排 import 分组 |
| `object-shorthand` | 9 | `--fix` |
| `prettier/prettier` | 6 | `--fix` |
| `@typescript-eslint/no-empty-object-type` | 4 | `interface X extends Y {}` → `type X = Y` |
| `@typescript-eslint/no-use-before-define` | 3 | `const fn = () => {}` → `function fn() {}`（`getHost` / `validateAuth` / `joinPathByParams`） |
| `@typescript-eslint/no-unused-expressions` | 1 | `this.timer && clearTimeout(...)` → `if (this.timer) { ... }` |
| `block-no-empty` | 1 | 删除 webview 页面的空 less 规则 |

当前结果：

```
yarn lint       → 0 error / 45 warning（32 no-unused-vars + 13 no-console）
yarn stylelint  → 0 problem
```

45 条 warning 全部来自原项目遗留的调试 `console.log` 与未使用的导入/变量，不阻塞构建；要清零可再跑一轮清理。

## 六、样式：项目用 Less，taro-ui 用 SCSS 怎么处理

**结论：两者不冲突，不需要转换。** Taro/Vite 按文件扩展名分派预处理器，`.less` 走 less，`.scss` 走 sass，同一个项目里可以共存；唯一前提是 `sass` 要装。之前 `sass` 只是 Taro 的传递依赖（`@tarojs/vite-runner → runner-utils → scss-bundle → sass`），已在 `devDependencies` 里显式声明 `sass@^1.108.2`。

但"能编译"不等于"该全量引入"。`taro-ui/dist/style/index.scss` 会把 40+ 个组件的样式全部打进产物：

| 方案 | 产物 `vendors.wxss` | 说明 |
| --- | --- | --- |
| `import "taro-ui/dist/style/index.scss"`（原写法） | **309 KB** | 全量组件样式 + icon 字体 |
| **按需引入 scss 子集（已采用）** | **35.5 KB** | 只引入实际用到的 8 个样式文件 |
| `import "taro-ui/dist/style/index.css"` | 约 273 KB | 预编译 CSS，不需要 sass，但仍然全量 |
| 把 taro-ui 的 scss 转成 less | — | 不推荐：要维护 40+ 文件的转换产物 |

按需清单集中在新文件 `src/asset/style/taro-ui.scss`，业务入口只引一行：

```ts
// src/app.tsx
import "asset/style/taro-ui.scss";
```

```scss
// src/asset/style/taro-ui.scss
// 项目本身用 Less，这里只作为第三方 SCSS 样式的统一出口
@import "taro-ui/dist/style/components/icon.scss";   // AtIcon（内含 iconfont base64）
@import "taro-ui/dist/style/components/button.scss"; // AtButton
@import "taro-ui/dist/style/components/modal.scss";  // AtModal / Content / Header / Action
@import "taro-ui/dist/style/components/input.scss";  // AtInput
@import "taro-ui/dist/style/components/switch.scss"; // AtSwitch
@import "taro-ui/dist/style/components/tabs.scss";   // AtTabs / AtTabsPane
@import "taro-ui/dist/style/components/flex.scss";   // 通用 flex 工具类
@import "taro-ui/dist/style/components/frozen.scss"; // AtModal 打开时锁定页面滚动
```

Taro 的 sass 解析器可以直接解析 `taro-ui/...` 这类裸包路径（已实测通过），所以 scss 聚合文件里不需要写相对路径或 `~`。新增 taro-ui 组件时只改这个文件，业务代码不动。

每个组件的 scss 自己 `@import '../variables/default.scss'` 和 mixins，因此可以独立引入；scss 变量是编译期的，不会重复输出。

验证方式：H5 构建后用 headless Chrome 逐页采集 DOM 里出现的 `at-*` 类，与编译后 CSS 里定义的选择器做差集，缺失集合为：

```
at-button--normal, at-tabs--WEB
```

这两个都是 Taro / taro-ui 运行期加的平台修饰类，taro-ui 样式里本来就没有定义，不是漏引。首页截图与全量版本 **sha256 完全一致**，地址页（AtTabs）、登录密码页（AtInput + AtButton）渲染正常。

注意：按需清单需要随组件增减同步；`taro-ui/dist/style/components/*.scss` 属于包内部路径，建议把 taro-ui 锁到确定版本（当前解析 3.4.2）。

### sass deprecation 警告的处理

构建时 sass 会打印两类 deprecation：`legacy-js-api`（Taro 用 legacy API 调 sass）和 `import`（taro-ui 与我们聚合文件都用了 `@import`），有一次构建还会折叠成「155 repetitive deprecation warnings omitted」。

结论：**不影响产物，纯日志噪音**。`@import` 要到 Dart Sass 3.0 才移除，而 sass 版本已锁在 `^1.108.2`（不含 2.x/3.x）；`legacy-js-api` 属于 Taro 内部调用方式，项目侧改不了。

已在 `config/index.ts` 静默（注意：Taro 4 里 `sassLoaderOption` 属于 **mini / h5 分支**，不是顶层，放顶层会被忽略）：

```ts
mini: {
    sassLoaderOption: {
        silenceDeprecations: ['legacy-js-api', 'import'],
    },
},
h5: {
    sassLoaderOption: {
        silenceDeprecations: ['legacy-js-api', 'import'],
    },
},
```

静默前后构建产物完全一致（`app-origin.wxss` 35.7 KB），weapp 与 h5 构建的 deprecation 条数都从 6+ 降到 0。将来若升级 sass 3 或 taro-ui 迁移到 `@use`，应删掉这段重新评估。

## 七、已知问题 / 后续

1. **taro-ui 版本漂移**：原项目锁 3.1.0-beta.7，本次装到 3.4.2（`^3.1.0-beta.7` 的语义）。页面渲染正常；若要严格对齐旧行为可改成固定版本并重装。
2. **`src/coressss/` 是 `wechat-core-app` 的旧源码副本，全项目无引用**（且缺 `roApp` 导出）。当前保留未删，建议确认后移除，避免误用。
3. **`src/component/navbar/index.tsx` 引用了不存在的 `asset/global/left.png`**（原项目同样如此，该组件未被引用，所以不影响构建）。若启用 navbar 需改成 `asset/img/global/left.png`。
4. **H5 端的接口请求仍会失败**：`src/http/config.ts` 里只有小程序各环境的真实域名，本地无后端/无登录态，控制台会看到 fetch 报错（属预期）。
5. **45 条 lint warning**（未使用变量 / `console.log`）尚未清理，`yarn lint` 需保持 0 error 即可；若要在 CI 加 `--max-warnings 0`，需先清完这批警告。
6. 未在微信开发者工具中实机运行：`dist/` 可直接用开发者工具打开，但 appid 仍是 `touristappid`（游客模式），真机预览/上传前需要替换成自己的 appid；渲染/交互需真机或模拟器确认。
7. `src/app.less`、`src/asset/less/global.less` 沿用原样式，未做 rpx 换算以外的调整。
