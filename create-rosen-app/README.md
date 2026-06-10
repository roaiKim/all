# create-rosen-app

> 一键创建 Rosen App 前端项目脚手架 — 同时支持 npm / yarn

## 是什么？

`create-rosen-app` 是一个 CLI 脚手架工具，类似 `create-react-app`。它基于 `app-bot` 模板快速创建一个全新的 Rosen App 项目，包含完整的项目结构、构建配置和核心框架。

## 项目技术栈

生成的项目包含以下技术选型：

| 类别 | 技术 |
|---|---|
| 构建工具 | Rsbuild（基于 Rspack） |
| 语言 | TypeScript 5.x |
| UI 框架 | React 19 + Ant Design 6 |
| 状态管理 | Redux + Immer |
| 路由 | React Router v7 |
| HTTP 层 | Axios（封装全局拦截器） |
| 样式方案 | Less + CSS Modules |
| 模块系统 | 内置 `roaikim` 框架（基于类的模块化架构） |

## 使用方式

> 需要先安装 [Node.js](https://nodejs.org) (≥18)，以及 npm / yarn。

### npm

```bash
npm create rosen-app my-app
npm create rosen-app my-app --install   # 创建后自动 npm install
```

### yarn

```bash
yarn create rosen-app my-app
yarn create rosen-app my-app --install  # 创建后自动 yarn install
```

### 本地开发 / 离线使用

```bash
# 1. 进入 create-rosen-app 目录
cd create-rosen-app

# 2. 注册到全局
npm link   # 或 yarn link

# 3. 在任意位置创建项目
npm create rosen-app my-app   # 或 yarn create rosen-app my-app
```

### 参数说明

```bash
npm create rosen-app <project-name> [options]
# 或
yarn create rosen-app <project-name> [options]
```

| 参数 | 说明 |
|---|---|
| `<project-name>` | 项目名（即目录名），只允许字母、数字、`-`、`_`、`.` |
| `--install` | 创建项目后自动安装依赖（使用当前包管理器） |
| `--help` / `-h` | 显示帮助信息 |

## 生成的项目结构

```
my-app/
├── src/
│   ├── index.tsx                 # 应用入口
│   ├── env.d.ts                  # 类型声明
│   ├── asset/                    # 静态资源
│   │   ├── image/                # 图片
│   │   └── styles/               # 全局样式（normalize、variable、main）
│   ├── components/               # 公共组件
│   │   ├── common/               # 通用组件（loading、page、global-mask）
│   │   ├── header-tab/           # 顶部标签栏
│   │   ├── bookmark-tabs/        # 书签标签
│   │   └── ...                   # 其他组件
│   ├── config/                   # 配置
│   │   ├── static-constant.ts    # 静态常量
│   │   ├── development.proxy.ts  # 开发代理
│   │   └── tabs.ts               # 标签配置
│   ├── http/                     # HTTP 请求层
│   │   ├── network.ts            # axios 封装 + 拦截器
│   │   ├── tools.ts              # URL 拼接、token 工具
│   │   └── config.ts             # HTTP 配置
│   ├── module/                   # 业务模块（基于 roaikim 框架）
│   │   └── <module-name>/        # 每个模块独立目录
│   │       ├── index.ts          # 模块类（继承 Module）
│   │       ├── type.ts           # 类型定义 + ModuleStatement
│   │       └── component/        # React 组件 + 样式
│   ├── type/                     # 全局类型
│   └── utils/                    # 工具函数
├── roaikim/                      # 核心框架（模块系统、Redux 封装、装饰器）
├── project/                      # 项目级配置
│   ├── config.ts                 # 应用配置
│   └── template/                 # 模块生成器模板
├── public/                       # HTML 模板 + favicon
├── rsbuild.config.ts             # Rsbuild 配置
├── tsconfig.json                 # TypeScript 配置
├── eslint.config.js              # ESLint 配置
└── package.json                  # 依赖与脚本
```

## 可用命令

在生成的项目中：

```bash
npm start           # 启动开发服务器（端口 10010）
npm run build       # 生产构建
npm run preview     # 本地预览生产构建
npm run module      # 运行模块模板生成器（创建新模块脚手架）
```

或使用 `yarn start` / `yarn build` 等。

## 工作原理

1. **检测包管理器** — 通过 `npm_config_user_agent` 判断 npm / yarn / pnpm
2. **解析参数** — 获取项目名和选项
3. **校验名称** — 确保项目名合法且不与保留字冲突
4. **检查目标目录** — 确保不会覆盖已有目录
5. **复制模板** — 将内置的 `app-bot` 模板复制到目标目录
6. **注入信息** — 将 `package.json` 的 `name` 替换为项目名
7. **创建配置文件** — 生成 `.env.development` 和 `.gitignore`
8. **安装依赖** — 可选：传 `--install` 时自动使用当前包管理器安装

## 许可

MIT
