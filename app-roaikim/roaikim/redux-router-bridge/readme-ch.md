# redux-router-bridge 中文文档

English README: [README.md](./README.md)

这是一个轻量的 `history <-> Redux` 双向同步桥接层，适合这类项目：

- 想继续使用真实的 `history` 实例作为导航真相
- 想在 Redux 中保留稳定的路由快照
- 想通过 Redux action 发起导航
- 需要和 React Router v7 风格项目配合同一个 `history` 实例工作


## 功能特性

- `history` 与 Redux router state 双向同步
- 同一个 `history + store` 组合自动去重注册
- 通过快照克隆隔离外部可变引用
- clone 和深比较都支持循环引用保护
- 支持 `reference / smart / deep` 三种 state 比较策略
- 支持 `onLocationChange` 监听最终生效路由变化
- 支持通过 `freezeSnapshots` 控制是否冻结快照
- 不依赖 saga

## 安装

```bash
npm install redux-router-bridge history redux
```

如果你使用 React Router v7，请确保 Router 和 bridge 复用的是同一个 `history` 实例。

## 快速开始

```ts
// index.tsx
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import {
    createReduxHistory,
    createRouterMiddleware,
    createRouterReducer,
    routerNavigateAction,
    type RouterState,
} from "redux-router-bridge";

const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: createRouterReducer(history),
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

```tsx
// Navigate.tsx
export default function () {
    // const dispatch = useDispatch(); // form react-redux
    return (
        <div>
            <button
                onClick={() => {
                    // dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
                    // dispatch(routerNavigateAction("/login", { replace: true }));
                    store.dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
                    store.ddispatch(routerNavigateAction("/login", { replace: true }));
                }}
            >
                navigationTo
            </button>
        </div>
    );
}
```

## 与 React Router v7 的关系

这个包不会替代 React Router，它只负责桥接 `history` 和 Redux。

最重要的规则只有一条：

- Router 用一个 `history`
- bridge 也必须用同一个 `history`

如果不是同一个实例，UI 和 Redux 中的路由状态就可能分叉。

## API

### `createRouterReducer(initialState)`

创建 router reducer，只处理 `ROUTER_LOCATION_CHANGED`，并把标准化后的路由快照写进 Redux。

### `createRouterMiddleware(history)`

拦截 `ROUTER_NAVIGATE`，再转成真正的 `history.push` / `history.replace`。

### `createReduxHistory(history, store, options?)`

启动双向同步层。

关键行为：

- 启动时会立刻把当前 history 快照写入 Redux
- 监听 `history.listen`，把 history 更新同步回 Redux
- 监听 store 更新，在必要时反向驱动 history
- 对同一个 `history + store` 组合做去重注册
- 返回一个清理函数

### `routerLocationAction(update)`

创建 `history -> Redux` 这条链路使用的标准化 action。

### `routerNavigateAction(to, options?)`

创建 `Redux -> history` 这条链路使用的导航意图 action。

## `CreateReduxHistoryOptions`

### `selectRouterState`

自定义如何从 Redux 根状态中取出 router slice。

默认值：

```ts
state => state.router
```

### `createLocationChangedAction`

自定义 `history -> Redux` 的 action 创建逻辑。

默认值：

```ts
routerLocationAction(update)
```

它最终仍然必须返回合法的 `ROUTER_LOCATION_CHANGED` action。

### `equalityFn`

覆盖完整的 `Location` 比较逻辑。

只有你确实需要完全替换内置比较策略时才建议使用。大多数情况直接用 `compareStateMode` 就够了。

### `compareStateMode`

控制内置逻辑下 `location.state` 的比较方式：

- `reference`：只比较引用
- `smart`：先比引用，再对数组 / plain object 做一层浅比较
- `deep`：对支持的结构化值做递归深比较

推荐默认值：`smart`

### `onLocationChange`

在路由真正生效后触发回调。

回调参数为：

```ts
{
    source: "init" | "history" | "redux";
    action: Action;
    location: Location;
    previousLocation: Location | null;
}
```

### `freezeSnapshots`

控制生成的快照是否做浅冻结。

- `false`：更兼容，业务代码误改 router state 时不容易立刻报错
- `true`：更严格，更早暴露误改问题

注意：冻结和克隆不是一回事。即使 `freezeSnapshots` 是 `false`，bridge 仍然会在必要时做克隆。

## 工作原理

主要有两条链路。

### 1. `history -> Redux`

1. `history.listen` 收到路由更新
2. bridge 生成 `routerLocationAction(update)`
3. router reducer 把标准化快照写入 Redux
4. 调用 `onLocationChange`

### 2. `Redux -> history`

1. 业务代码 dispatch `routerNavigateAction(...)`
2. middleware 把 action 转成 `history.push` / `history.replace`
3. history 真实发生变化
4. `history.listen` 再把最终结果回流到 Redux
5. 调用 `onLocationChange`

这种设计的核心就是：

- `history` 仍然是最终真相
- Redux 中保存的是最终已经生效的快照

## 为什么必须克隆

`history.location` 是外部对象。如果 Redux 直接保存它的引用：

- 业务误改会污染同步基准
- 相等判断可能失真
- Redux DevTools 里看到的状态可能与真实导航过程不一致

所以 bridge 会克隆它支持的 `location.state` 结构。

支持的结构：

- primitive
- 数组
- plain object

不支持深拷贝的复杂对象会直接原样返回，例如：

- `Date`
- `Map`
- `Set`
- 类实例
- DOM 对象

这是刻意的保守设计，避免 bridge 擅自定义复杂对象的拷贝语义。

## 性能说明

- 标准化过的 `RouterState` / `Location` 会记录到 `WeakSet`
- 同一个 `history + store` 组合通过 `WeakMap` 去重
- `smart` 模式默认不做递归深比较，性能更稳
- 深比较带循环引用保护
- reducer 不会重复克隆已经标准化过的快照

## 构建这个包

这个包使用 [Rslib](https://rslib.rs/)。

## 更多

- English README: [README.md](./README.md) 
