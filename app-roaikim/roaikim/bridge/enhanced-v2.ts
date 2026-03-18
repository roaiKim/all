import type { Action, History, Location, To, Update } from "history";
import type { AnyAction, Middleware, Reducer, Store } from "redux";

/**
 * Redux 中保存的路由快照。
 *
 * 约定只保存两部分：
 * - `location`：当前地址信息
 * - `action`：最近一次 history 动作（POP / PUSH / REPLACE）
 *
 * 这个对象会被 bridge 标准化成快照对象，用作 Redux 中的路由状态。
 */
export interface RouterState {
    location: Location;
    action: Action;
}

export const ROUTER_LOCATION_CHANGED = "@@redux-router/LOCATION_CHANGED";
export const ROUTER_NAVIGATE = "@@redux-router/NAVIGATE";

/**
 * history -> Redux 的同步 action。
 */
export interface RouterLocationChangedAction {
    type: typeof ROUTER_LOCATION_CHANGED;
    payload: RouterState;
}

/**
 * Redux -> history 的导航意图 action。
 */
export interface RouterNavigateAction {
    type: typeof ROUTER_NAVIGATE;
    payload: {
        to: To;
        replace?: boolean;
        state?: unknown;
    };
}

export type RouterAction = RouterLocationChangedAction | RouterNavigateAction;

/**
 * 控制 `location.state` 的比较策略。
 *
 * - `reference`：只比较 state 引用，最快
 * - `smart`：先比引用，再做一层浅比较，默认
 * - `deep`：对支持的结构化 state 做递归深比较
 */
export type StateCompareMode = "reference" | "smart" | "deep";

/**
 * onLocationChange 的变化来源。
 */
export type LocationChangeSource = "init" | "history" | "redux";

/**
 * 路由变化监听回调参数。
 */
export interface LocationChangeInfo {
    source: LocationChangeSource;
    action: Action;
    location: Location;
    previousLocation: Location | null;
}

/**
 * createReduxHistory 的可选配置。
 */
export interface CreateReduxHistoryOptions<S = unknown> {
    /**
     * 指定如何从整个 Redux 根状态里取出 router slice。
     *
     * 默认实现等价于：
     * `state => state.router`
     *
     * 什么时候需要自定义：
     * - 你的路由状态不叫 `router`
     * - 你的 router 被包在更深层级里，例如 `state.app.router`
     * - 你想在 bridge 内部复用已有 selector
     *
     * 注意：
     * - 返回值必须是 `RouterState`
     * - 如果这里返回错了，bridge 就无法正确判断 Redux 当前路由
     * - 这个函数会在初始化同步、store 订阅回调里被频繁调用，建议保持纯函数且足够轻量
     */
    selectRouterState?: (state: S) => RouterState;

    /**
     * 自定义“history 变化 -> Redux action”这一步的 action 构造方式。
     *
     * 默认使用 `routerLocationChanged(update)`，
     * 也就是直接生成一个标准的 `ROUTER_LOCATION_CHANGED` action。
     *
     * 适合自定义的场景：
     * - 你想额外补充埋点字段、来源字段、时间戳
     * - 你已经有一套统一的 action 工厂，想保持项目风格一致
     * - 你想把 action 包装成更贴合现有 reducer 体系的结构
     *
     * 重要约束：
     * - 最终必须返回一个合法的 `ROUTER_LOCATION_CHANGED` action
     * - `type` 必须保持为 `ROUTER_LOCATION_CHANGED`
     * - `payload` 必须是合法的 `RouterState`
     *
     * 如果返回值不满足要求，bridge 会直接抛出 `TypeError`，
     * 因为这说明同步链路已经失去可预测性。
     */
    createLocationChangedAction?: (update: Update) => RouterLocationChangedAction;

    /**
     * 自定义两个 `Location` 是否“等价”的判断逻辑。
     *
     * 默认逻辑会比较：
     * - `pathname`
     * - `search`
     * - `hash`
     * - `key`
     * - `state`
     *
     * 默认的 `state` 比较方式又会受 `compareStateMode` 控制。
     *
     * 这个回调的作用非常关键：
     * - 返回 `true`：认为 Redux 与 history 已经一致，不再继续驱动导航
     * - 返回 `false`：认为两边不一致，bridge 会执行 `push/replace`
     *
     * 因此自定义时要非常谨慎：
     * - 判断过松，可能漏掉本该同步的路由变化
     * - 判断过严，可能导致不必要的 history 写入
     * - 如果判断逻辑不稳定，极端情况下会增加重复同步风险
     *
     * 建议：
     * - 如果只是想控制 `location.state` 的比较深度，优先使用 `compareStateMode`
     * - 只有在你确实需要完全替换默认比较策略时再覆盖这个参数
     */
    equalityFn?: (a: Location, b: Location) => boolean;

    /**
     * 控制默认 `location.state` 的比较策略。
     *
     * 仅在你没有自定义 `equalityFn` 时生效。
     *
     * 可选值：
     * - `reference`
     *   只比较 `state` 引用是否同一个对象，性能最好；
     *   适合你明确依赖不可变数据、每次 state 变化都会换引用的场景。
     * - `smart`
     *   先做引用比较；如果引用不同，但两边都是数组或 plain object，
     *   再做一层浅比较；这是默认值，兼顾性能和容错。
     * - `deep`
     *   会对支持的结构化数据做递归深比较；
     *   适合你明确想接受“深层值相等但引用不同”的场景。
     *
     * 选择建议：
     * - 大多数业务保持默认 `smart` 即可
     * - 对性能非常敏感且 router state 严格不可变，选 `reference`
     * - 确实存在“深层内容一样但引用会变化”的业务，再考虑 `deep`
     */
    compareStateMode?: StateCompareMode;

    /**
     * 监听“最终生效”的路由变化。
     *
     * 触发时机：
     * - bridge 初始化把当前 history 快照写入 Redux 后，会触发一次，`source` 为 `init`
     * - 浏览器前进/后退、history.listen 收到变化时，会触发，`source` 为 `history`
     * - Redux 侧改了 router，bridge 反向驱动 history，随后 history 回流时，会触发，`source` 为 `redux`
     *
     * 回调参数里包含：
     * - `location`：当前已生效的新地址
     * - `previousLocation`：上一次记录的地址，没有则为 `null`
     * - `action`：这次 history 动作（POP / PUSH / REPLACE）
     * - `source`：变化来源
     *
     * 典型用途：
     * - 页面访问埋点
     * - 路由切换日志
     * - 业务层在路由稳定后触发额外副作用
     *
     * 建议保持这个回调：
     * - 不要直接改写传入的 `location`
     * - 不要做过重的同步计算
     * - 若需要异步副作用，尽量把耗时逻辑放到异步任务中
     */
    onLocationChange?: (info: LocationChangeInfo) => void;

    /**
     * 是否冻结 bridge 生成的路由快照对象。
     *
     * 默认值：`false`
     *
     * 设计原因：
     * - 你前面提到更希望“业务误改时尽量不报错，让代码继续执行”
     * - 所以这里默认不冻结，避免业务代码写入 `router.location` 时因为 `Object.freeze`
     *   直接抛异常，影响线上流程
     *
     * 开启后会发生什么：
     * - bridge 产出的快照对象会做浅冻结
     * - 误改这些对象时，更容易尽早暴露问题
     * - 但业务如果确实存在直接改 router 状态的代码，就可能在运行时报错
     *
     * 适用建议：
     * - 线上兼容优先：保持 `false`
     * - 开发期排查误改：可设为 `true`
     *
     * 注意：
     * - 这里控制的是“是否冻结”，不是“是否克隆”
     * - 即使设为 `false`，bridge 仍然会为了隔离 history/Redux 引用而执行必要克隆
     */
    freezeSnapshots?: boolean;
}

/**
 * 同一个 history/store 组合的内部注册信息。
 * 用于避免重复注册监听。
 */
interface SyncRegistration {
    refCount: number;
    stop: () => void;
}

/**
 * 用于对同一个 `history + store` 组合做去重注册。
 *
 * 结构为：
 * history -> store -> registration
 */
const syncRegistry = new WeakMap<History, WeakMap<Store<any, AnyAction>, SyncRegistration>>();

/**
 * 标记已经标准化过的 RouterState，命中后可跳过重复 clone。
 */
const normalizedRouterStateRegistry = new WeakSet<object>();

/**
 * 标记已经标准化过的 Location，命中后可直接复用。
 */
const normalizedLocationRegistry = new WeakSet<object>();

/**
 * 把 history Update 转成标准化后的 Redux action。
 *
 * 这里默认生成“冻结快照”，因为这个 action creator 是通用导出函数，
 * 更适合作为安全默认值。
 */
export const routerLocationChanged = (update: Update): RouterLocationChangedAction => ({
    type: ROUTER_LOCATION_CHANGED,
    payload: createNormalizedRouterState(update.location, update.action, true),
});

/**
 * 创建导航意图 action。
 *
 * 这里只描述“要去哪里”，不在这里做深度标准化，
 * 真正的 payload 规范化统一放到 middleware 里做一次。
 */
export const routerNavigate = (to: To, options?: { replace?: boolean; state?: unknown }): RouterNavigateAction => ({
    type: ROUTER_NAVIGATE,
    payload: {
        to,
        replace: options?.replace,
        state: options?.state,
    },
});

/**
 * 创建 router reducer。
 *
 * reducer 只做一件事：
 * - 接收 ROUTER_LOCATION_CHANGED
 * - 把 router slice 替换成新的标准化快照
 */
export const createRouterReducer = (initialState: RouterState): Reducer<RouterState, RouterAction> => {
    const normalizedInitialState = createNormalizedRouterState(initialState.location, initialState.action, true);

    return (state = normalizedInitialState, action) => {
        if (action.type !== ROUTER_LOCATION_CHANGED) {
            return state;
        }

        if (!isRouterLocationChangedAction(action)) {
            return state;
        }

        return normalizeRouterState(action.payload, true);
    };
};

/**
 * 创建导航中间件。
 *
 * 它负责把 `ROUTER_NAVIGATE` 转成真正的 `history.push/replace`。
 * 同时在这里集中完成 payload 的运行时校验和标准化，避免重复 clone。
 */
export const createRouterMiddleware = (history: History): Middleware<object, any> => {
    assertHistory(history);

    return () => (next) => (action: AnyAction) => {
        if (action?.type !== ROUTER_NAVIGATE) {
            return next(action);
        }

        const payload = normalizeNavigatePayload(action.payload, true);
        const result = next({
            ...action,
            payload,
        });

        if (payload.replace) {
            history.replace(payload.to, payload.state);
        } else {
            history.push(payload.to, payload.state);
        }

        return result;
    };
};

/**
 * 启动 history 与 Redux router slice 的双向同步。
 *
 * 负责两件事：
 * - history 变化时写回 Redux
 * - Redux 中 router 变化时反向驱动 history
 *
 * 关键特性：
 * - 同一个 history/store 重复调用不会重复注册监听
 * - 可以控制 state 比较策略
 * - 可以监听最终生效的路由变化
 * - 可以控制是否冻结快照
 *
 * 关于 `freezeSnapshots`：
 * - 默认是 `false`
 * - 这样即使业务代码误改 router 状态，也尽量不会因为写冻结对象而抛错
 * - 如果你希望更严格地暴露误改问题，可显式传 `true`
 */
export const createReduxHistory = <S = unknown>(history: History, store: Store<S, AnyAction>, options: CreateReduxHistoryOptions<S> = {}) => {
    assertHistory(history);
    assertStore(store);

    const historyRegistry = getHistoryRegistry(history);
    const existing = historyRegistry.get(store);
    if (existing) {
        existing.refCount += 1;
        return () => releaseRegistration(historyRegistry, store, existing);
    }

    const selectRouterState = options.selectRouterState ?? ((state: S) => (state as any).router as RouterState);
    const createLocationChangedAction = options.createLocationChangedAction ?? routerLocationChanged;
    const compareStateMode = options.compareStateMode ?? "smart";
    const equalityFn = options.equalityFn ?? ((a: Location, b: Location) => locationsEqual(a, b, compareStateMode));
    const onLocationChange = options.onLocationChange;
    const freezeSnapshots = options.freezeSnapshots ?? false;

    let isDispatchingFromHistory = false;
    let lastRouterLocation: Location | null = null;
    let nextLocationChangeSource: LocationChangeSource = "history";

    /**
     * 把 history 变化写回 Redux。
     */
    const dispatchLocationChanged = (update: Update, source: LocationChangeSource) => {
        const previousLocation = lastRouterLocation;
        const action = createLocationChangedAction({
            action: normalizeAction(update.action),
            location: update.location,
        });

        if (!isRouterLocationChangedAction(action)) {
            throw new TypeError("createLocationChangedAction must return a valid ROUTER_LOCATION_CHANGED action");
        }

        isDispatchingFromHistory = true;
        store.dispatch(action as AnyAction);
        const syncedRouterState = selectRouterState(store.getState());
        lastRouterLocation = isRouterState(syncedRouterState) ? syncedRouterState.location : action.payload.location;
        isDispatchingFromHistory = false;

        onLocationChange?.({
            source,
            action: normalizeAction(update.action),
            location: lastRouterLocation,
            previousLocation,
        });
    };

    const unlisten = history.listen((update) => {
        const source = nextLocationChangeSource;
        nextLocationChangeSource = "history";
        dispatchLocationChanged(update, source);
    });

    /**
     * 先把初始 history 快照写入 Redux。
     */
    dispatchLocationChanged(
        {
            action: history.action,
            location: history.location,
        },
        "init"
    );

    /**
     * 监听 Redux 中 router 的变化，并反向驱动 history。
     */
    const unsubscribe = store.subscribe(() => {
        if (isDispatchingFromHistory) {
            return;
        }

        const routerState = selectRouterState(store.getState());
        if (!isRouterState(routerState)) {
            return;
        }

        if (lastRouterLocation && routerState.location === lastRouterLocation) {
            return;
        }

        lastRouterLocation = routerState.location;
        if (equalityFn(routerState.location, history.location)) {
            return;
        }

        const nextTo = toHistoryTarget(routerState.location);
        const nextState = cloneState(routerState.location.state, new WeakMap(), freezeSnapshots);
        nextLocationChangeSource = "redux";

        if (routerState.action === "REPLACE") {
            history.replace(nextTo, nextState);
        } else {
            history.push(nextTo, nextState);
        }
    });

    const registration: SyncRegistration = {
        refCount: 1,
        stop: () => {
            unsubscribe();
            unlisten();
            historyRegistry.delete(store);
        },
    };

    historyRegistry.set(store, registration);
    return () => releaseRegistration(historyRegistry, store, registration);
};

/**
 * 获取某个 history 对应的 store 注册表。
 * 不存在时懒创建。
 */
function getHistoryRegistry(history: History): WeakMap<Store<any, AnyAction>, SyncRegistration> {
    let historyRegistry = syncRegistry.get(history);
    if (!historyRegistry) {
        historyRegistry = new WeakMap<Store<any, AnyAction>, SyncRegistration>();
        syncRegistry.set(history, historyRegistry);
    }
    return historyRegistry;
}

/**
 * 释放一次 bridge 注册。
 * 只有引用计数归零时才真正移除监听。
 */
function releaseRegistration(
    historyRegistry: WeakMap<Store<any, AnyAction>, SyncRegistration>,
    store: Store<any, AnyAction>,
    registration: SyncRegistration
) {
    const current = historyRegistry.get(store);
    if (!current || current !== registration) {
        return;
    }

    registration.refCount -= 1;
    if (registration.refCount <= 0) {
        registration.stop();
    }
}

/**
 * 校验 history 是否具备 bridge 所需的最小能力。
 */
function assertHistory(history: unknown): asserts history is History {
    if (!isHistoryLike(history)) {
        throw new TypeError("A valid history instance is required");
    }
}

/**
 * 校验 store 是否具备 bridge 所需的最小能力。
 */
function assertStore(store: unknown): asserts store is Store<any, AnyAction> {
    if (!isStoreLike(store)) {
        throw new TypeError("A valid Redux store is required");
    }
}

/**
 * 判断一个值是否“像” history。
 */
function isHistoryLike(value: unknown): value is History {
    const history = value as History;
    return !!history && typeof history.listen === "function" && typeof history.push === "function" && typeof history.replace === "function";
}

/**
 * 判断一个值是否“像” Redux store。
 */
function isStoreLike(value: unknown): value is Store<any, AnyAction> {
    const store = value as Store<any, AnyAction>;
    return !!store && typeof store.getState === "function" && typeof store.dispatch === "function" && typeof store.subscribe === "function";
}

/**
 * 判断一个值是否为合法的 ROUTER_LOCATION_CHANGED action。
 */
function isRouterLocationChangedAction(value: unknown): value is RouterLocationChangedAction {
    const action = value as RouterLocationChangedAction;
    return !!action && action.type === ROUTER_LOCATION_CHANGED && isRouterState(action.payload);
}

/**
 * 判断一个值是否为合法的 RouterState。
 */
function isRouterState(value: unknown): value is RouterState {
    const state = value as RouterState;
    return !!state && isLocationLike(state.location) && isHistoryAction(state.action);
}

/**
 * 判断一个值是否具备 Location 的核心字段。
 */
function isLocationLike(value: unknown): value is Location {
    const location = value as Location;
    return (
        !!location &&
        typeof location.pathname === "string" &&
        typeof location.search === "string" &&
        typeof location.hash === "string" &&
        (typeof location.key === "string" || typeof location.key === "undefined")
    );
}

/**
 * 只接受 history 标准动作。
 */
function isHistoryAction(value: unknown): value is Action {
    return value === "POP" || value === "PUSH" || value === "REPLACE";
}

/**
 * 规范化 action，不支持的值直接抛错。
 */
function normalizeAction(action: unknown): Action {
    if (!isHistoryAction(action)) {
        throw new TypeError(`Unsupported history action: ${String(action)}`);
    }

    return action;
}

/**
 * 规范化 RouterState。
 * 如果已经是标准化快照则直接复用。
 */
function normalizeRouterState(state: RouterState, freezeSnapshots: boolean): RouterState {
    if (isNormalizedRouterState(state)) {
        return state;
    }

    return createNormalizedRouterState(state.location, state.action, freezeSnapshots);
}

/**
 * 创建标准化后的 RouterState。
 */
function createNormalizedRouterState(location: Location, action: Action, freezeSnapshots: boolean): RouterState {
    const normalizedRouterState = finalizeSnapshot(
        {
            action: normalizeAction(action),
            location: cloneLocation(location, freezeSnapshots),
        },
        freezeSnapshots
    );

    normalizedRouterStateRegistry.add(normalizedRouterState);
    return normalizedRouterState;
}

/**
 * 判断一个 RouterState 是否已经被当前 bridge 标记为标准化快照。
 */
function isNormalizedRouterState(value: unknown): boolean {
    return !!value && typeof value === "object" && normalizedRouterStateRegistry.has(value as object);
}

/**
 * 对 ROUTER_NAVIGATE 的 payload 做统一校验和标准化。
 */
function normalizeNavigatePayload(payload: unknown, freezeSnapshots: boolean): RouterNavigateAction["payload"] {
    const value = payload as RouterNavigateAction["payload"];
    if (!value || !isToLike(value.to)) {
        throw new TypeError("ROUTER_NAVIGATE requires a valid payload.to");
    }

    if (typeof value.replace !== "undefined" && typeof value.replace !== "boolean") {
        throw new TypeError("ROUTER_NAVIGATE payload.replace must be boolean when provided");
    }

    return {
        to: cloneTo(value.to, freezeSnapshots),
        replace: value.replace,
        state: cloneState(value.state, new WeakMap(), freezeSnapshots),
    };
}

/**
 * 判断一个值是否可以作为导航目标 To。
 */
function isToLike(value: unknown): value is To {
    if (typeof value === "string") {
        return true;
    }

    if (!value || typeof value !== "object") {
        return false;
    }

    const to = value as Exclude<To, string>;
    return (
        (typeof to.pathname === "string" || typeof to.pathname === "undefined") &&
        (typeof to.search === "string" || typeof to.search === "undefined") &&
        (typeof to.hash === "string" || typeof to.hash === "undefined")
    );
}

/**
 * 标准化 To。
 * string 直接复用，对象形式按配置决定是否冻结。
 */
function cloneTo(to: To, freezeSnapshots: boolean): To {
    if (typeof to === "string") {
        return to;
    }

    return finalizeSnapshot(
        {
            pathname: to.pathname,
            search: to.search,
            hash: to.hash,
        },
        freezeSnapshots
    );
}

/**
 * 从 Location 中提取 history.push/replace 所需的目标对象。
 */
function toHistoryTarget(location: Location): Exclude<To, string> {
    return {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
    };
}

/**
 * 把 Location 标准化成快照对象。
 *
 * 为什么需要克隆：
 * 1. history.location 是外部对象，bridge 不应直接把它裸放进 Redux
 * 2. 如果 Redux 与 history 共用同一份 location/state 引用，
 *    业务代码误改 `state.router.location` 时就会污染同步基准
 * 3. clone 后 bridge 才能把 Redux 中的 router 当作独立快照使用
 *
 * 如果完全不克隆，常见问题是：
 * - router.location 被外部意外修改
 * - bridge 的相等判断失真
 * - Redux 调试里看到的路由状态与真实导航过程不一致
 *
 * 注意：
 * - 这里不强制冻结，默认尽量不让业务误改时抛错
 * - 是否冻结由 freezeSnapshots 控制
 */
function cloneLocation(location: Location, freezeSnapshots: boolean): Location {
    if (isNormalizedLocation(location)) {
        return location;
    }

    const clonedLocation = finalizeSnapshot(
        {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
            key: location.key,
            state: cloneState(location.state, new WeakMap(), freezeSnapshots),
        },
        freezeSnapshots
    ) as Location;

    normalizedLocationRegistry.add(clonedLocation);
    return clonedLocation;
}

/**
 * 判断一个 Location 是否已经标准化过。
 */
function isNormalizedLocation(value: unknown): boolean {
    return !!value && typeof value === "object" && normalizedLocationRegistry.has(value as object);
}

/**
 * 克隆 bridge 支持的 state 类型。
 *
 * 只处理：
 * - primitive
 * - 数组
 * - plain object
 *
 * 其它复杂对象（Date / Map / Set / 类实例 / DOM 等）直接原样返回，
 * 避免 bridge 擅自破坏复杂对象语义。
 *
 * `seen` 用于处理循环引用。
 */
function cloneState<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap(), freezeSnapshots: boolean = false): T {
    if (isPrimitiveStateValue(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        if (seen.has(value)) {
            return seen.get(value) as T;
        }

        const clone: unknown[] = [];
        seen.set(value, clone);
        for (const item of value) {
            clone.push(cloneState(item, seen, freezeSnapshots));
        }

        return finalizeSnapshot(clone, freezeSnapshots) as T;
    }

    if (isPlainObject(value)) {
        if (seen.has(value)) {
            return seen.get(value) as T;
        }

        const clone: Record<string, unknown> = {};
        seen.set(value, clone);
        for (const [key, item] of Object.entries(value)) {
            clone[key] = cloneState(item, seen, freezeSnapshots);
        }

        return finalizeSnapshot(clone, freezeSnapshots) as T;
    }

    return value;
}

/**
 * 判断一个值是否为 primitive。
 */
function isPrimitiveStateValue(value: unknown): boolean {
    return value === null || (typeof value !== "object" && typeof value !== "function");
}

/**
 * 判断一个值是否为 plain object。
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || typeof value !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

/**
 * 浅冻结一个对象。
 */
function freezeShallow<T extends object>(value: T): T {
    return Object.freeze(value);
}

/**
 * 根据配置决定是否冻结快照对象。
 *
 * 默认不冻结，这样业务代码误改 router 状态时尽量不报错；
 * 如果你希望更早暴露误改问题，可把 freezeSnapshots 设为 true。
 */
function finalizeSnapshot<T extends object>(value: T, freezeSnapshots: boolean): T {
    return freezeSnapshots ? freezeShallow(value) : value;
}

/**
 * 默认的 Location 相等判断策略。
 *
 * 顺序是：
 * 1. 先比较 pathname/search/hash/key
 * 2. 再比较 state 引用
 * 3. 必要时按 compareStateMode 决定做浅比较还是深比较 state
 */
function locationsEqual(a: Location, b: Location, compareStateMode: StateCompareMode = "smart"): boolean {
    return (
        a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && stateEquals(a.state, b.state, compareStateMode)
    );
}

/**
 * 判断两个 state 是否属于 bridge 可比较的结构化类型。
 *
 * 只有下面两类才进入后续浅/深比较：
 * - 数组 <-> 数组
 * - plain object <-> plain object
 *
 * 像 Date / Map / Set / 类实例这类复杂对象不做结构比较，
 * 仍然遵循“同引用才算相等”的策略，避免 bridge 擅自定义它们的语义。
 */
function canCompareStructuredState(a: unknown, b: unknown): boolean {
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray || bIsArray) {
        return aIsArray && bIsArray;
    }

    return isPlainObject(a) && isPlainObject(b);
}

/**
 * 对支持的结构化 state 做一层浅比较。
 *
 * 这个函数用于 `smart` 模式：
 * - 父级对象/数组引用变了，但顶层字段或顶层元素仍然复用原引用时，仍可判等
 * - 不再继续递归，避免把 `smart` 做成和 `deep` 一样重
 */
function shallowStateValuesEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let index = 0; index < a.length; index += 1) {
            if (!Object.is(a[index], b[index])) {
                return false;
            }
        }

        return true;
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }

        for (const key of aKeys) {
            if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}

/**
 * 根据 compareStateMode 选择 state 比较策略。
 */
function stateEquals(a: unknown, b: unknown, compareStateMode: StateCompareMode): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (compareStateMode === "reference") {
        return false;
    }

    if (!canCompareStructuredState(a, b)) {
        return false;
    }

    if (compareStateMode === "smart") {
        return shallowStateValuesEqual(a, b);
    }

    return stateValuesEqual(a, b);
}

/**
 * 深比较支持的结构化 state，并带循环引用保护。
 */
function stateValuesEqual(a: unknown, b: unknown, seenPairs: WeakMap<object, WeakSet<object>> = new WeakMap()): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        if (hasSeenPair(a, b, seenPairs)) {
            return true;
        }

        for (let index = 0; index < a.length; index += 1) {
            if (!stateValuesEqual(a[index], b[index], seenPairs)) {
                return false;
            }
        }
        return true;
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }

        if (hasSeenPair(a, b, seenPairs)) {
            return true;
        }

        for (const key of aKeys) {
            if (!Object.prototype.hasOwnProperty.call(b, key) || !stateValuesEqual(a[key], b[key], seenPairs)) {
                return false;
            }
        }
        return true;
    }

    return false;
}

/**
 * 记录已经比较过的对象对，避免循环引用导致无限递归。
 */
function hasSeenPair(a: object, b: object, seenPairs: WeakMap<object, WeakSet<object>>): boolean {
    let pairedObjects = seenPairs.get(a);
    if (!pairedObjects) {
        pairedObjects = new WeakSet<object>();
        seenPairs.set(a, pairedObjects);
    } else if (pairedObjects.has(b)) {
        return true;
    }

    pairedObjects.add(b);
    return false;
}
