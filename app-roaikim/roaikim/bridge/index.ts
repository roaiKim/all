import type {
    Action, // history 中的动作类型
    History, // history 实例类型
    Location, // location 类型
    To, // 跳转目标类型
    Update, // history 变更通知类型
} from "history"; // 仅导入类型，避免运行时依赖
import type {
    AnyAction, // Redux 的通用 action 类型
    Middleware, // Redux 中间件类型
    Reducer, // Redux reducer 类型
    Store, // Redux store 类型
} from "redux"; // 仅导入类型，避免运行时依赖

export interface RouterState {
    // Router 在 Redux 中的状态结构
    location: Location; // 当前 location
    action: Action; // 最近一次动作类型
}

export const ROUTER_LOCATION_CHANGED = "@@redux-router/LOCATION_CHANGED"; // history -> Redux 的同步动作
export const ROUTER_NAVIGATE = "@@redux-router/NAVIGATE"; // Redux -> history 的导航动作

export interface RouterLocationChangedAction {
    // location 变更动作类型
    type: typeof ROUTER_LOCATION_CHANGED; // 固定类型
    payload: RouterState; // 变更后的路由状态
}

export interface RouterNavigateAction {
    // 导航动作类型
    type: typeof ROUTER_NAVIGATE; // 固定类型
    payload: {
        // 导航参数
        to: To; // 目标地址
        replace?: boolean; // 是否 replace
        state?: unknown; // 附带 state
    };
}

export type RouterAction = RouterLocationChangedAction | RouterNavigateAction; // Router 相关 action 的联合类型

export interface CreateReduxHistoryOptions<S = unknown> {
    // createReduxHistory 可选配置
    selectRouterState?: (state: S) => RouterState; // 从 store 中选择 router state 的函数
    createLocationChangedAction?: (update: Update) => RouterLocationChangedAction; // 自定义 location 变更 action 的生成函数
    equalityFn?: (a: Location, b: Location) => boolean; // 自定义 location 比较函数
}

export const routerLocationChanged = (update: Update): RouterLocationChangedAction => ({
    // 将 history Update 转成 Redux action
    type: ROUTER_LOCATION_CHANGED, // 固定类型
    payload: {
        // router 状态
        location: update.location, // 直接复用 history 的 location 引用
        action: update.action, // 复用 history 的 action
    },
});

export const routerNavigate = (to: To, options?: { replace?: boolean; state?: unknown }): RouterNavigateAction => ({
    // 生成导航 action
    type: ROUTER_NAVIGATE, // 固定类型
    payload: {
        // 导航参数
        to, // 目标地址
        replace: options?.replace, // 是否 replace
        state: options?.state, // 附带 state
    },
});

export const createRouterReducer = (initialState: RouterState): Reducer<RouterState, RouterAction> => {
    // 创建 router reducer
    return (state = initialState, action) => {
        // reducer 实现
        if (action.type === ROUTER_LOCATION_CHANGED) {
            // 仅处理 location 变更
            return action.payload; // 用新的 router state 覆盖旧值
        }
        return state; // 其它 action 原样返回
    };
};

export const createRouterMiddleware = (history: History): Middleware<object, any, (action: AnyAction) => AnyAction> => {
    // 创建导航中间件
    return () => (next) => (action: AnyAction) => {
        // 标准中间件签名
        if (action?.type !== ROUTER_NAVIGATE) {
            // 只拦截导航 action
            return next(action); // 非导航 action 直接透传
        }

        if (!action.payload || typeof (action.payload as RouterNavigateAction["payload"]).to === "undefined") {
            // 校验 payload 是否包含 to
            throw new TypeError("ROUTER_NAVIGATE requires payload.to"); // 明确抛错，避免静默失败
        }

        const { to, replace, state } = action.payload as RouterNavigateAction["payload"]; // 读取导航参数
        const result = next(action); // 先交给下游 reducer 处理
        if (replace) {
            // 需要 replace
            history.replace(to, state); // 触发 history replace
        } else {
            // 默认 push
            history.push(to, state); // 触发 history push
        }

        return result; // 返回下游结果
    };
};

const locationsEqual = (a: Location, b: Location): boolean => {
    // 判断两个 location 是否等价
    return (
        // 按字段逐一比较
        a.pathname === b.pathname && // 路径相同
        a.search === b.search && // 查询参数相同
        a.hash === b.hash && // hash 相同
        a.state === b.state && // state 引用相同（可通过 options.equalityFn 自定义）
        a.key === b.key // key 相同
    );
};

const isHistoryLike = (value: unknown): value is History => {
    // 运行时校验 history 实例
    const h = value as History; // 尝试转换为 History
    return !!h && typeof h.listen === "function" && typeof h.push === "function" && typeof h.replace === "function"; // 校验关键方法
};

const isStoreLike = <S>(value: unknown): value is Store<S, AnyAction> => {
    // 运行时校验 store 实例
    const s = value as Store<S, AnyAction>; // 尝试转换为 Store
    return !!s && typeof s.getState === "function" && typeof s.dispatch === "function" && typeof s.subscribe === "function"; // 校验关键方法
};

export const createReduxHistory = <S = unknown>( // 创建 Redux 与 history 的双向同步
    history: History, // history 实例
    store: Store<S, AnyAction>, // Redux store
    options: CreateReduxHistoryOptions<S> = {} // 可选配置
) => {
    // 返回一个取消同步函数
    if (!isHistoryLike(history)) {
        // history 运行时校验
        throw new TypeError("createReduxHistory requires a valid history instance"); // 参数错误提示
    }
    if (!isStoreLike<S>(store)) {
        // store 运行时校验
        throw new TypeError("createReduxHistory requires a valid Redux store"); // 参数错误提示
    }

    const selectRouterState = options.selectRouterState ?? ((state: S) => (state as any).router as RouterState); // 默认从 state.router 读取
    const createLocationChangedAction = options.createLocationChangedAction ?? routerLocationChanged; // 默认 action 生成器
    const equalityFn = options.equalityFn ?? locationsEqual; // 默认使用内置比较函数
    let isDispatchingFromHistory = false; // 标记当前更新是否来自 history
    let lastRouterLocation: Location | null = null; // 缓存上一次的 router.location 引用

    const unlisten = history.listen((update) => {
        // 监听 history 变化
        isDispatchingFromHistory = true; // 标记为 history 驱动
        store.dispatch(createLocationChangedAction(update) as AnyAction); // 将变化写入 Redux
        lastRouterLocation = update.location; // 更新缓存
        isDispatchingFromHistory = false; // 清除标记
    });

    // Ensure initial state references the history location object.
    isDispatchingFromHistory = true; // 标记为 history 驱动
    store.dispatch(
        // 写入一次初始状态，确保引用同源
        createLocationChangedAction({
            // 复用 history 当前值
            action: history.action, // 当前动作
            location: history.location, // 当前 location
        })
    );
    lastRouterLocation = history.location; // 初始化缓存
    isDispatchingFromHistory = false; // 清除标记

    const unsubscribe = store.subscribe(() => {
        // 监听 Redux 变化
        if (isDispatchingFromHistory) {
            // 忽略由 history 触发的 Redux 更新
            return; // 避免双向循环
        }
        const routerState = selectRouterState(store.getState()); // 读取 router state
        if (!routerState) {
            // 未配置 router state 时直接跳过
            return; // 不做任何事
        }
        if (routerState.location === lastRouterLocation) {
            // router.location 引用未变
            return; // 直接跳过，减少比较开销
        }
        lastRouterLocation = routerState.location; // 更新缓存
        if (!equalityFn(routerState.location, history.location)) {
            // Redux 与 history 不一致
            const { pathname, search, hash, state } = routerState.location; // 取出 location 字段
            if (routerState.action === "REPLACE") {
                // 根据 routerState.action 决定 replace
                history.replace({ pathname, search, hash }, state); // 使用 replace 同步
            } else {
                // 默认 push
                history.push({ pathname, search, hash }, state); // 触发 history 更新，随后由 listener 回写 Redux
            }
        }
    });

    return () => {
        // 返回清理函数
        unsubscribe(); // 取消 Redux 订阅
        unlisten(); // 取消 history 监听
    };
};
