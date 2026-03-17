# redux-router-bridge

让 `react-router@7` 和 `react-redux@9` 共用一个 `history`，并且以 Redux 中的路由状态为准。最终效果是 `state.router.location === history.location`。

## 安装

```bash
npm i redux-router-bridge history
```

## 用法

```tsx
import { createBrowserHistory } from "history";
import { unstable_HistoryRouter } from "react-router-dom";
import { applyMiddleware, combineReducers, createStore } from "redux";
import {
  createReduxHistory,
  createRouterMiddleware,
  createRouterReducer,
  routerNavigate
} from "redux-router-bridge";

const history = createBrowserHistory();

const rootReducer = combineReducers({
  router: createRouterReducer({
    location: history.location,
    action: history.action
  })
});

const store = createStore(
  rootReducer,
  applyMiddleware(createRouterMiddleware(history))
);

// 启动双向同步：history -> Redux，Redux -> history
const stopSync = createReduxHistory(history, store);

// Router 使用同一个 history
const App = () => (
  <unstable_HistoryRouter history={history}>
    {/* routes */}
  </unstable_HistoryRouter>
);

// 通过 Redux 发起导航（state 为准）
store.dispatch(routerNavigate("/settings", { replace: false }));
```

## 设计说明

- Redux 里的 `router.location` 是单一数据源。
- `history.listen` 会把最新 `history.location` 写回 Redux，从而保证引用相同。
- 当 Redux 中的 `router.location` 不同于 `history.location` 时，会触发 `history.push`，然后由监听回写 Redux，避免双源分叉。

## 注意

如果你使用自定义 `router` slice 名称或结构，传入 `createReduxHistory(history, store, { selectRouterState })` 即可。
