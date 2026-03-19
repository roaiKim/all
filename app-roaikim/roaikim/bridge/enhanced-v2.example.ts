import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import {
    createReduxHistory,
    createRouterMiddleware,
    createRouterReducer,
    routerNavigateAction,
    type RouterState,
} from "./enhanced-v2";

// 1. 创建浏览器 history。Router 和 bridge 最终都应共享这一个实例。
const history = createBrowserHistory();

// 2. 构造 router 初始状态。
// 这里直接以当前 history.location / history.action 作为初始值。
const initialRouterState: RouterState = {
    location: history.location,
    action: history.action,
};

// 3. 创建根 reducer。
// router reducer 负责把 history 的快照存进 Redux。
const rootReducer = combineReducers({
    router: createRouterReducer(initialRouterState),
});

// 4. 创建 store，并挂上 router middleware。
// middleware 会把 ROUTER_NAVIGATE action 转成真正的 history.push/replace。
const store = createStore(rootReducer, undefined, applyMiddleware(createRouterMiddleware(history)));

// 5. 启动 history <-> Redux 双向同步。
// 调用后：
// - history 改变会写回 Redux
// - Redux 中 router 改变会反向驱动 history
//
// 这里额外演示两个新增参数：
// - compareStateMode: 控制 location.state 的比较策略
// - onLocationChange: 监听最终生效的路由变化
// - freezeSnapshots: 是否冻结快照；这里传 false，尽量不让业务误改时抛错
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

// 6. 通过 Redux 发起导航。
// 这种方式适合把“导航”也纳入统一 action 流。
store.dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
store.dispatch(routerNavigateAction("/login", { replace: true }));

// 7. 当不再需要同步时，调用 stopSync() 解除监听。
// 一般单页应用生命周期内只初始化一次，不需要主动 stop。
void stopSync;
