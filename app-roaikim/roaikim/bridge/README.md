# bridge/enhanced-v2 使用文档

`enhanced-v2.ts` 是一个轻量的 `history <-> Redux` 双向同步桥接层。

它解决的是这类问题：

- 项目已经在用 `history`
- 路由状态还想同步进 Redux，方便统一调试、埋点、联动副作用
- 又不想再引入 saga 或老的 router-redux 类库
- 希望和 `react-router v7` 的使用方式保持兼容

它的核心目标不是“接管 Router”，而是：

- 让 `history` 仍然是实际导航执行者
- 让 Redux 里保留一份稳定、可比较、可订阅的路由快照
- 避免重复注册、循环同步、无意义重复执行

对应源码文件：

- 实现：`D:\3_e\all\app-roaikim\roaikim\bridge\enhanced-v2.ts`
- 示例：`D:\3_e\all\app-roaikim\roaikim\bridge\enhanced-v2.example.ts`

## 1. 适合什么场景

适合下面这些项目：

- 需要把当前路由写进 Redux，供业务 selector、日志、埋点使用
- 希望通过 dispatch 一个 action 来导航，而不是到处直接 `history.push`
- 需要监听“最终已经生效”的路由变化
- 想避免老方案里常见的循环 dispatch、重复同步、状态引用污染

不太适合下面这些情况：

- 项目根本不需要 Redux 中的路由状态
- 业务完全使用 React Router 自带 hooks，且不需要额外同步层
- `location.state` 里大量塞复杂实例对象，并强依赖这些对象的原型/方法语义

## 2. 它解决了什么问题

相较于最原始的“自己监听 history 然后 dispatch”做法，这个版本额外处理了这些细节：

- 去重注册：同一个 `history + store` 多次调用 `createReduxHistory` 不会重复绑监听
- 防循环：区分 `history -> Redux` 和 `Redux -> history` 两个方向，避免相互回打
- 快照隔离：写进 Redux 的 `location` 会被克隆，避免和外部对象共用引用
- 比较可控：支持 `reference / smart / deep` 三种 `location.state` 比较策略
- 循环引用保护：`cloneState` 和深比较都能处理循环引用
- 限制 state 范围：只对 `plain object / array / primitive` 做结构处理，复杂对象原样保留
- 兼容误改：默认不冻结快照，业务代码误改 router 状态时尽量不直接报错

## 3. 导出的能力

`enhanced-v2.ts` 主要导出下面这些内容：

- `createRouterReducer(initialState)`
  - 创建 router reducer
  - 只处理 `ROUTER_LOCATION_CHANGED`

- `createRouterMiddleware(history)`
  - 拦截 `ROUTER_NAVIGATE`
  - 调用 `history.push` / `history.replace`

- `createReduxHistory(history, store, options?)`
  - 建立 `history <-> Redux` 双向同步
  - 返回一个停止同步的函数

- `routerNavigateAction(to, options?)`
  - 创建导航意图 action
  - 适合在业务里统一 dispatch

- `routerLocationAction(update)`
  - 创建 `history -> Redux` 的路由变更 action

## 4. 快速接入

### 4.1 创建 history

```ts
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
```

### 4.2 创建 router reducer

```ts
import { combineReducers } from "redux";
import { createRouterReducer, type RouterState } from "./enhanced-v2";
import { history } from "./history";

const initialRouterState: RouterState = {
    location: history.location,
    action: history.action,
};

export const rootReducer = combineReducers({
    router: createRouterReducer(initialRouterState),
});
```

### 4.3 创建 middleware 和 store

```ts
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { createRouterMiddleware } from "./enhanced-v2";
import { rootReducer } from "./rootReducer";
import { history } from "./history";

export const store = createStore(rootReducer, undefined, applyMiddleware(createRouterMiddleware(history)));
```

### 4.4 启动同步

```ts
import { createReduxHistory } from "./enhanced-v2";
import { history } from "./history";
import { store } from "./store";

export const stopSync = createReduxHistory(history, store, {
    compareStateMode: "smart",
    freezeSnapshots: false,
});
```

### 4.5 在业务里发起导航

```ts
import { routerNavigateAction } from "./enhanced-v2";
import { store } from "./store";

store.dispatch(routerNavigateAction("/settings"));
store.dispatch(routerNavigateAction("/login", { replace: true }));
store.dispatch(
    routerNavigateAction("/detail", {
        state: { from: "dashboard", id: 123 },
    })
);
```

## 5. 和 React Router v7 的关系

这个 bridge 不替代 React Router。

它只是负责：

- 监听 `history`
- 把最新路由快照写进 Redux
- 在 Redux router 变化时反向驱动 `history`

所以接入 React Router v7 时，重点是：

- Router 使用的 `history`
- bridge 使用的 `history`

必须是同一个实例。

如果项目里有自定义 Router 包装层，或者使用 `HistoryRouter` / `unstable_HistoryRouter` 一类适配器，也要确保传入的是同一个 `history` 实例。否则 Router 看的是一份地址，Redux 同步的是另一份地址，最终就会分叉。

## 6. 完整使用示例

```ts
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import {
    createReduxHistory,
    createRouterMiddleware,
    createRouterReducer,
    routerNavigateAction,
    type RouterState,
} from "./enhanced-v2";

const history = createBrowserHistory();

const initialRouterState: RouterState = {
    location: history.location,
    action: history.action,
};

const rootReducer = combineReducers({
    router: createRouterReducer(initialRouterState),
});

const store = createStore(rootReducer, undefined, applyMiddleware(createRouterMiddleware(history)));

const stopSync = createReduxHistory(history, store, {
    compareStateMode: "smart",
    freezeSnapshots: false,
    onLocationChange: ({ source, action, location, previousLocation }) => {
        console.log("[router-change]", {
            source,
            action,
            from: previousLocation?.pathname ?? null,
            to: location.pathname,
        });
    },
});

store.dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
store.dispatch(routerNavigateAction("/login", { replace: true }));

void stopSync;
```

也可以直接参考：

- `D:\3_e\all\app-roaikim\roaikim\bridge\enhanced-v2.example.ts`

## 7. createReduxHistoryOptions 详解

### `selectRouterState`

作用：

- 告诉 bridge 如何从根 state 中取出 router slice

默认等价于：

```ts
state => state.router
```

适合自定义的场景：

- router slice 不叫 `router`
- router 嵌套得更深，比如 `state.app.router`

示例：

```ts
createReduxHistory(history, store, {
    selectRouterState: (state) => state.app.router,
});
```

### `createLocationChangedAction`

作用：

- 自定义 `history` 变化后 dispatch 到 Redux 的 action 结构

默认使用：

```ts
routerLocationAction(update)
```

约束：

- `type` 必须还是 `ROUTER_LOCATION_CHANGED`
- `payload` 必须是合法的 `RouterState`

适合场景：

- 想统一 action 风格
- 想补埋点字段或时间戳

### `equalityFn`

作用：

- 自定义两个 `Location` 是否视为相等

这个参数优先级高于 `compareStateMode`。

也就是说：

- 传了 `equalityFn`，就以你自己的比较逻辑为准
- 没传时，才使用内置的 `compareStateMode`

不建议随便重写，原因是：

- 判断太松，会漏同步
- 判断太严，会产生不必要导航
- 判断不稳定，可能增加重复执行风险

### `compareStateMode`

控制默认 `location.state` 的比较方式。

可选值：

- `reference`
  - 只认同一引用
  - 性能最好
  - 适合严格不可变数据

- `smart`
  - 先比引用
  - 引用不同但两边都是数组或 plain object 时，再做一层浅比较
  - 默认值
  - 适合大多数业务

- `deep`
  - 对支持的结构数据做递归深比较
  - 适合“值相等但引用经常变化”的场景

推荐：

- 默认先用 `smart`
- 性能优先并且状态管理规范，选 `reference`
- 只有确实需要深层值相等时再用 `deep`

### `onLocationChange`

作用：

- 监听最终已经生效的路由变化

回调参数：

```ts
type LocationChangeInfo = {
    source: "init" | "history" | "redux";
    action: Action;
    location: Location;
    previousLocation: Location | null;
};
```

三种 `source` 的含义：

- `init`
  - bridge 初始化时，把当前 history 快照写入 Redux

- `history`
  - 浏览器前进/后退
  - 或外部直接调用了 `history.push/replace`

- `redux`
  - Redux 中 router 改变
  - bridge 反向执行 `history.push/replace`
  - 然后由 history 回流触发

适合场景：

- 页面访问埋点
- 页面切换日志
- 路由稳定后触发异步副作用

### `freezeSnapshots`

作用：

- 控制 bridge 生成的快照对象是否做浅冻结

默认值：

```ts
false
```

为什么默认是 `false`：

- 你的需求是“业务误改时尽量不报错，让代码继续执行”
- 所以默认不冻结，减少运行时报错风险

需要注意：

- `freezeSnapshots: false` 不代表“不克隆”
- bridge 仍然会克隆必要的路由快照，避免引用污染
- 它只代表“克隆后的结果是否再 `Object.freeze`”

## 8. 工作原理

### 8.1 整体流程

可以把它理解成两条链路：

#### 链路 A：history -> Redux

1. 浏览器地址变化，或者外部调用 `history.push/replace`
2. `history.listen` 收到更新
3. bridge 生成 `ROUTER_LOCATION_CHANGED`
4. reducer 把新的路由快照写入 Redux
5. 触发 `onLocationChange`

#### 链路 B：Redux -> history

1. 业务 dispatch `routerNavigateAction(...)`
2. middleware 拦截后调用 `history.push/replace`
3. history 发生真实变化
4. `history.listen` 再把结果回写 Redux
5. 触发 `onLocationChange`

### 8.2 为什么要“回写 Redux”

因为真正的导航结果最终还是要以 `history` 为准。

如果 Redux 直接把自己的路由对象当最终真相，而不等 history 真正变化，就会出现：

- Redux 以为已经跳了
- 但浏览器地址栏还没变
- Router 实际匹配的页面也未必同步完成

所以这个 bridge 的策略是：

- 导航动作可以从 Redux 发起
- 但最终以 history 生效后的结果回写 Redux

这样 Redux 里保留的是“最终生效快照”，不是“中间意图”。

### 8.3 为什么要克隆 `location`

因为 `history.location` 是外部对象。

如果直接把它裸放进 Redux，会有几个风险：

- Redux 和 history 共用同一个对象引用
- 业务代码误改 `state.router.location` 时，会反向污染同步基准
- 相等判断会失真
- DevTools 里看到的状态可能和真实导航过程不一致

所以 bridge 会把写入 Redux 的 `location` 变成独立快照。

### 8.4 如果完全不克隆会怎样

常见后果：

- 外部误改 router 状态，影响后续同步判断
- 本来没变的路由，被误判成变了
- 本来变了的路由，被误判成没变
- 调试时看到的历史状态不可信

### 8.5 为什么不是所有对象都深克隆

`location.state` 允许用户传任何值。

但 bridge 只会对下面这些类型做结构处理：

- primitive
- array
- plain object

这些类型最适合做“路由快照”。

而这些复杂对象会原样保留：

- `Date`
- `Map`
- `Set`
- 类实例
- DOM 对象
- 其它自定义复杂引用

原因是：

- bridge 无法安全定义它们的深拷贝语义
- 贸然克隆可能破坏原型、方法、内部状态

所以这里采取的是更保守的策略：只处理安全可预测的结构。

### 8.6 克隆几次

不同路径次数不同。

#### 情况 1：dispatch `routerNavigateAction`

通常会发生两次主要克隆：

1. middleware 里规范化 `payload.state` 时克隆一次
2. history 真实变化后，回写 Redux 时再把 `location.state` 克隆一次

也就是说：

- 发起导航时有一次
- 最终写入 Redux 快照时还有一次

#### 情况 2：浏览器前进后退，或外部直接调用 `history.push`

通常只发生一次主要克隆：

1. history 回写 Redux 时克隆

#### 情况 3：直接手改 Redux 里的 router slice

如果业务直接改 router 并触发了 Redux -> history -> Redux 这条链路，通常会有：

1. Redux 侧把 router 推给 history 前克隆一次
2. history 回写 Redux 时再克隆一次

### 8.7 深比较什么时候发生

不是每次 history 回写 Redux 都会深比较。

深比较主要发生在：

- store 订阅阶段
- 也就是 bridge 判断“Redux 当前 router.location 和 history.location 是否等价”时

而且只有满足下面条件时才会继续比较：

- `pathname/search/hash/key` 基本字段一致
- `state` 不是同一个引用
- `compareStateMode` 不是 `reference`
- 两边的 `state` 都是 bridge 支持的结构类型

### 8.8 `reference / smart / deep` 的区别

#### `reference`

只看：

- `Object.is(a, b)`

优点：

- 最快

缺点：

- 只要引用变了，即使值一样也算不同

#### `smart`

流程是：

1. 先看引用是否相同
2. 如果不同，但两边都是数组或 plain object
3. 只做一层浅比较

优点：

- 比 `deep` 省
- 又比纯引用比较更稳一些

适合：

- 顶层字段一般稳定复用
- 不想每次都递归

#### `deep`

流程是：

1. 先看引用
2. 再递归比较数组 / plain object
3. 内部带循环引用保护

优点：

- 容忍“值没变但引用换了”的情况

代价：

- 更重

## 9. 性能设计点

`enhanced-v2.ts` 里有几处专门的性能设计：

- 标准化标记
  - 已经标准化过的 `RouterState` / `Location` 会被记录到 `WeakSet`
  - 命中后可以跳过重复标准化

- 去重注册
  - 同一个 `history + store` 组合通过 `WeakMap` 去重
  - 避免重复监听和多次执行

- 比较分层
  - 先比较 `pathname/search/hash/key`
  - 再比较 `state`
  - 避免一上来就递归比较

- 限制结构处理范围
  - 只处理 plain object / array / primitive
  - 避免在复杂对象上做高成本且不可靠的操作

## 10. 安全性与稳定性说明

### 10.1 关于误改 router 状态

默认配置下：

- 业务误改 `state.router.location` 尽量不会直接因为冻结而报错

但这不代表误改是安全的。

误改后仍然可能导致：

- 相等判断失真
- 无意义导航
- 调试困难

默认只是更偏向“线上兼容”，而不是鼓励这么做。

### 10.2 关于 `location.state`

建议只放：

- 字符串
- 数字
- 布尔值
- `null`
- 数组
- 普通对象

不建议放：

- class 实例
- `Map` / `Set`
- 带方法对象
- 巨大深层对象
- 不可序列化的大对象

原因是这些值：

- 不利于快照比较
- 不利于调试
- 有时也不适合跨导航边界传递

## 11. 常见问题

### Q1：为什么 dispatch `routerNavigateAction` 后，还是由 history 回写 Redux？

因为真正的导航结果必须以 history 为准。  
`routerNavigateAction` 只是“导航意图”，不是最终生效快照。

### Q2：为什么默认不冻结？

因为你的业务诉求是误改时尽量不报错，优先保证业务继续运行。  
如果项目更强调规范约束，可以手动打开 `freezeSnapshots: true`。

### Q3：为什么 `smart` 不直接做深比较？

因为默认模式更应该兼顾性能。  
如果 `smart` 也递归到底，那它和 `deep` 的区别就消失了。

### Q4：会不会重复注册导致回调执行多次？

正常不会。  
同一个 `history + store` 组合会做去重注册，并通过引用计数管理释放。

### Q5：停止同步函数什么时候用？

单页应用大多数情况下只需要初始化一次。  
如果你在测试、微前端卸载、局部容器销毁场景下需要释放监听，再调用返回的 `stopSync()`。

## 12. 推荐实践

- `compareStateMode` 默认先用 `smart`
- `freezeSnapshots` 线上优先用 `false`
- `location.state` 尽量只放轻量 plain data
- Router、bridge、业务代码统一复用同一个 `history` 实例
- 不要直接手改 Redux 中的 router 状态
- 如果只是导航，优先 dispatch `routerNavigateAction`

## 13. 文件关系建议

如果你后续要在项目里落地，推荐保持下面这种结构：

```txt
bridge/
  enhanced-v2.ts
  enhanced-v2.example.ts
  README.md
```

这样方便：

- 源码实现看 `enhanced-v2.ts`
- 接入方式看 `enhanced-v2.example.ts`
- 设计说明和原理看 `README.md`
