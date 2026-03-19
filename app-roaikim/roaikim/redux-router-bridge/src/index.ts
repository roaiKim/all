import type { Action, History, Location, To, Update } from "history";
import type { Middleware, Reducer, Store, UnknownAction } from "redux";

/**
 * Redux 中保存的路由快照。
 * 约定只保存两部分：
 * - `location`：当前地址信息
 * - `action`：最近一次 history 动作（POP / PUSH / REPLACE）
 * 这个对象会被 bridge 标准化成快照对象，用作 Redux 中的路由状态。
 *
 * Router snapshot stored inside Redux.
 * The bridge intentionally stores only two fields:
 * - `location`: the current location payload
 * - `action`: the latest history action (POP / PUSH / REPLACE)
 * The bridge normalizes this object into a snapshot and uses it as router state in Redux.
 */
export interface RouterState {
    location: Location;
    action: Action;
}

export const ROUTER_LOCATION_CHANGED = "@@redux-router/LOCATION_CHANGED";
export const ROUTER_NAVIGATE = "@@redux-router/NAVIGATE";

/**
 * history -> Redux 的同步 action。
 *
 * Action used for syncing history updates back into Redux.
 */
export interface RouterLocationChangedAction extends UnknownAction {
    type: typeof ROUTER_LOCATION_CHANGED;
    payload: RouterState;
}

/**
 * Redux -> history 的导航意图 action。
 *
 * Action that represents a navigation intent from Redux to history.
 */
export interface RouterNavigateAction extends UnknownAction {
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
 * - `reference`：只比较 state 引用，最快
 * - `smart`：先比引用，再做一层浅比较，默认
 * - `deep`：对支持的结构化 state 做递归深比较
 *
 * Controls how `location.state` is compared.
 * - `reference`: compare state references only, fastest mode
 * - `smart`: compare references first, then do a one-level shallow comparison, default mode
 * - `deep`: recursively deep-compare supported structured state values
 */
export type StateCompareMode = "reference" | "smart" | "deep";

/**
 * onLocationChange 的变化来源。
 *
 * Source of a location change reported by `onLocationChange`.
 */
export type LocationChangeSource = "init" | "history" | "redux";

/**
 * 路由变化监听回调参数。
 *
 * Payload passed to the route change listener.
 */
export interface LocationChangeInfo {
    source: LocationChangeSource;
    action: Action;
    location: Location;
    previousLocation: Location | null;
}

/**
 * createReduxHistory 的可选配置。
 *
 * Optional configuration for `createReduxHistory`.
 */
export interface CreateReduxHistoryOptions<S = unknown> {
    /**
     * 指定如何从整个 Redux 根状态里取出 router slice。
     * 默认实现等价于：
     * 什么时候需要自定义：
     * - 你的路由状态不叫 `router`
     * - 你的 router 被包在更深层级里，例如 `state.app.router`
     * - 你想在 bridge 内部复用已有 selector
     * 注意：
     * - 返回值必须是 `RouterState`
     * - 如果这里返回错了，bridge 就无法正确判断 Redux 当前路由
     * - 这个函数会在初始化同步、store 订阅回调里被频繁调用，建议保持纯函数且足够轻量
     *
     * Specifies how to select the router slice from the Redux root state.
     * The default implementation is equivalent to:
     * `state => state.router`
     * When to customize this selector:
     * - your router state is not stored under `router`
     * - your router state lives deeper, for example `state.app.router`
     * - you want to reuse an existing selector
     * Notes:
     * - the return value must be a valid `RouterState`
     * - an invalid return value breaks the bridge's understanding of the current route
     * - this function is called frequently during initialization and store subscriptions, so keep it pure and lightweight
     */
    selectRouterState?: (state: S) => RouterState;

    /**
     * 自定义“history 变化 -> Redux action”这一步的 action 构造方式。
     * 默认使用 `routerLocationAction(update)`。
     * 适合自定义的场景：
     * - 你想额外补充埋点字段、来源字段、时间戳
     * - 你已经有一套统一的 action 工厂，想保持项目风格一致
     * - 你想把 action 包装成更贴合现有 reducer 体系的结构
     * 重要约束：
     * - 最终必须返回一个合法的 `ROUTER_LOCATION_CHANGED` action
     * - `type` 必须保持为 `ROUTER_LOCATION_CHANGED`
     * - `payload` 必须是合法的 `RouterState`
     * 如果返回值不满足要求，bridge 会直接抛出 `TypeError`。
     *
     * Customizes how a `history -> Redux` action is created.
     * By default the bridge uses `routerLocationAction(update)`.
     * Typical customization scenarios:
     * - you want to append analytics fields, source fields, or timestamps
     * - you already have a project-wide action factory and want consistent style
     * - you want to wrap the action to better fit your reducer conventions
     * Important constraints:
     * - it must return a valid `ROUTER_LOCATION_CHANGED` action
     * - `type` must remain `ROUTER_LOCATION_CHANGED`
     * - `payload` must be a valid `RouterState`
     * The bridge throws a `TypeError` if the returned action does not meet these requirements.
     */
    createLocationChangedAction?: (update: Update) => RouterLocationChangedAction;

    /**
     * 自定义两个 `Location` 是否“等价”的判断逻辑。
     * 默认逻辑会比较：
     * 默认的 `state` 比较方式又会受 `compareStateMode` 控制。
     * 这个回调的作用非常关键：
     * - 返回 `true`：认为 Redux 与 history 已经一致，不再继续驱动导航
     * - 返回 `false`：认为两边不一致，bridge 会执行 `push/replace`
     * 因此自定义时要非常谨慎。
     *
     * Overrides the equality check used for two `Location` objects.
     * The default logic compares:
     * - `pathname`
     * - `search`
     * - `hash`
     * - `key`
     * - `state`
     * The default `state` comparison is additionally controlled by `compareStateMode`.
     * This callback is critical because:
     * - returning `true` means Redux and history are already in sync, so no navigation is triggered
     * - returning `false` means they differ, so the bridge issues `push/replace`
     * Customize it carefully because an unstable equality function can cause missed syncs or redundant navigations.
     */
    equalityFn?: (a: Location, b: Location) => boolean;

    /**
     * 控制默认 `location.state` 的比较策略。
     * 仅在你没有自定义 `equalityFn` 时生效。
     * 选择建议：
     * - 大多数业务保持默认 `smart` 即可
     * - 对性能非常敏感且 router state 严格不可变，选 `reference`
     * - 只有确实需要深层值相等时再用 `deep`
     *
     * Controls the default comparison strategy for `location.state`.
     * This option only applies when you do not provide a custom `equalityFn`.
     * Recommended usage:
     * - keep the default `smart` mode for most applications
     * - choose `reference` if performance is critical and router state is strictly immutable
     * - use `deep` only when you truly need deep value equality
     */
    compareStateMode?: StateCompareMode;

    /**
     * 监听“最终生效”的路由变化。
     * 触发时机：
     * - bridge 初始化写入首个 history 快照后会触发一次，`source` 为 `init`
     * - 浏览器前进/后退或外部 history 更新时触发，`source` 为 `history`
     * - Redux 反向驱动 history 成功回流后触发，`source` 为 `redux`
     *
     * Observes route changes after they have actually taken effect.
     * Trigger timing:
     * - one call fires after the initial history snapshot is written, with `source` set to `init`
     * - calls triggered by browser navigation or external history changes use `source: "history"`
     * - calls triggered after Redux drives history and the change flows back use `source: "redux"`
     */
    onLocationChange?: (info: LocationChangeInfo) => void;

    /**
     * 是否冻结 bridge 生成的快照对象。
     * 默认值：`false`
     * 这里控制的是“是否冻结”，不是“是否克隆”。
     * 即使为 `false`，bridge 仍然会执行必要克隆以隔离引用。
     *
     * Controls whether snapshots created by the bridge are frozen.
     * Default value: `false`
     * This flag controls freezing, not cloning.
     * Even when set to `false`, the bridge still clones when needed to isolate references.
     */
    freezeSnapshots?: boolean;
}

/**
 * 同一个 history/store 组合的内部注册信息。
 * 用于避免重复注册监听。
 *
 * Internal registration record for the same history/store pair.
 * Used to prevent duplicate listener registration.
 */
interface SyncRegistration {
    refCount: number;
    stop: () => void;
}

/**
 * 用于对同一个 `history + store` 组合做去重注册。
 * 结构为：
 *
 * Registry used to deduplicate subscriptions for the same `history + store` pair.
 * Structure:
 * history -> store -> registration
 */
const syncRegistry = new WeakMap<History, WeakMap<Store<any, UnknownAction>, SyncRegistration>>();

/**
 * 标记已经标准化过的 RouterState，命中后可跳过重复 clone。
 *
 * Marks normalized `RouterState` objects so repeated cloning can be skipped.
 */
const normalizedRouterStateRegistry = new WeakSet<object>();

/**
 * 标记已经标准化过的 Location，命中后可直接复用。
 *
 * Marks normalized `Location` objects so they can be reused directly.
 */
const normalizedLocationRegistry = new WeakSet<object>();

/**
 * 把 history Update 转成标准化后的 Redux action。
 * 这里默认生成“冻结快照”，因为这个 action creator 是通用导出函数，
 * 更适合作为安全默认值。
 *
 * Converts a history update into a normalized Redux action.
 * A frozen snapshot is produced here by default because this action creator is a public utility,
 * and a safer default is better for a reusable export.
 */
export const routerLocationAction = (update: Update): RouterLocationChangedAction => ({
    type: ROUTER_LOCATION_CHANGED,
    payload: createNormalizedRouterState(update.location, update.action, true),
});

/**
 * 创建导航意图 action。
 * 这里只描述“要去哪里”，不在这里做深度标准化。
 * 真正的 payload 规范化统一放到 middleware 里做一次。
 *
 * Creates a navigation intent action.
 * This function only describes where to navigate and does not perform deep normalization here.
 * Payload normalization is centralized in the middleware and performed only once there.
 */
export const routerNavigateAction = (to: To, options?: { replace?: boolean; state?: unknown }): RouterNavigateAction => ({
    type: ROUTER_NAVIGATE,
    payload: {
        to,
        replace: options?.replace,
        state: options?.state,
    },
});
/**
 * 创建 router reducer。
 * reducer 只做一件事：
 * - 接收 ROUTER_LOCATION_CHANGED
 * - 把 router slice 替换成新的标准化快照
 *
 * Creates the router reducer.
 * The reducer only does one thing:
 * - receives `ROUTER_LOCATION_CHANGED`
 * - replaces the router slice with a new normalized snapshot
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
 * 它负责把 `ROUTER_NAVIGATE` 转成真正的 `history.push/replace`。
 * 同时在这里集中完成 payload 的运行时校验和标准化，避免重复 clone。
 *
 * Creates the navigation middleware.
 * It converts `ROUTER_NAVIGATE` into real `history.push/replace` calls.
 * Runtime validation and normalization are also centralized here to avoid repeated clones.
 */
export const createRouterMiddleware = (history: History): Middleware<object, any> => {
    assertHistory(history);

    return () => (next) => (action: UnknownAction) => {
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
 * 负责两件事：
 * - history 变化时写回 Redux
 * - Redux 中 router 变化时反向驱动 history
 * 关键特性：
 * - 同一个 history/store 重复调用不会重复注册监听
 * - 可以控制 state 比较策略
 * - 可以监听最终生效的路由变化
 * - 可以控制是否冻结快照
 * 关于 `freezeSnapshots`：
 * - 默认是 `false`
 * - 这样即使业务代码误改 router 状态，也尽量不会因为写冻结对象而抛错
 * - 如果你希望更严格地暴露误改问题，可显式传 `true`
 *
 * Starts the two-way synchronization between history and the Redux router slice.
 * It is responsible for two tasks:
 * - write history changes back into Redux
 * - drive history when the Redux router state changes
 * Key properties:
 * - repeated calls with the same history/store pair do not register duplicate listeners
 * - the state comparison strategy is configurable
 * - you can observe the final route changes that actually took effect
 * - snapshot freezing can be configured
 * About `freezeSnapshots`:
 * - the default is `false`
 * - this reduces the chance of runtime errors when application code mutates router state by mistake
 * - pass `true` if you want stricter mutation detection
 */
export const createReduxHistory = <S = unknown>(history: History, store: Store<S, UnknownAction>, options: CreateReduxHistoryOptions<S> = {}) => {
    assertHistory(history);
    assertStore(store);

    const historyRegistry = getHistoryRegistry(history);
    const existing = historyRegistry.get(store);
    if (existing) {
        existing.refCount += 1;
        return () => releaseRegistration(historyRegistry, store, existing);
    }

    const selectRouterState = options.selectRouterState ?? ((state: S) => (state as any).router as RouterState);
    const createLocationChangedAction = options.createLocationChangedAction ?? routerLocationAction;
    const compareStateMode = options.compareStateMode ?? "smart";
    const equalityFn = options.equalityFn ?? ((a: Location, b: Location) => locationsEqual(a, b, compareStateMode));
    const onLocationChange = options.onLocationChange;
    const freezeSnapshots = options.freezeSnapshots ?? false;

    let isDispatchingFromHistory = false;
    let lastRouterLocation: Location | null = null;
    let nextLocationChangeSource: LocationChangeSource = "history";

    /**
     * 把 history 变化写回 Redux。
     *
     * Writes a history change back into Redux.
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
        store.dispatch(action);
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
     *
     * Writes the initial history snapshot into Redux first.
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
     *
     * Subscribes to router changes in Redux and drives history in the opposite direction.
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
 *
 * Gets the store registry for a specific history instance.
 * The registry is created lazily when missing.
 */
function getHistoryRegistry(history: History): WeakMap<Store<any, UnknownAction>, SyncRegistration> {
    let historyRegistry = syncRegistry.get(history);
    if (!historyRegistry) {
        historyRegistry = new WeakMap<Store<any, UnknownAction>, SyncRegistration>();
        syncRegistry.set(history, historyRegistry);
    }
    return historyRegistry;
}

/**
 * 释放一次 bridge 注册。
 * 只有引用计数归零时才真正移除监听。
 *
 * Releases one bridge registration.
 * Listeners are removed only when the reference count reaches zero.
 */
function releaseRegistration(
    historyRegistry: WeakMap<Store<any, UnknownAction>, SyncRegistration>,
    store: Store<any, UnknownAction>,
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
 *
 * Validates that history exposes the minimum capabilities required by the bridge.
 */
function assertHistory(history: unknown): asserts history is History {
    if (!isHistoryLike(history)) {
        throw new TypeError("A valid history instance is required");
    }
}

/**
 * 校验 store 是否具备 bridge 所需的最小能力。
 *
 * Validates that the store exposes the minimum capabilities required by the bridge.
 */
function assertStore(store: unknown): asserts store is Store<any, UnknownAction> {
    if (!isStoreLike(store)) {
        throw new TypeError("A valid Redux store is required");
    }
}

/**
 * 判断一个值是否“像” history。
 *
 * Checks whether a value looks like a history instance.
 */
function isHistoryLike(value: unknown): value is History {
    const history = value as History;
    return !!history && typeof history.listen === "function" && typeof history.push === "function" && typeof history.replace === "function";
}

/**
 * 判断一个值是否“像” Redux store。
 *
 * Checks whether a value looks like a Redux store.
 */
function isStoreLike(value: unknown): value is Store<any, UnknownAction> {
    const store = value as Store<any, UnknownAction>;
    return !!store && typeof store.getState === "function" && typeof store.dispatch === "function" && typeof store.subscribe === "function";
}

/**
 * 判断一个值是否为合法的 ROUTER_LOCATION_CHANGED action。
 *
 * Checks whether a value is a valid `ROUTER_LOCATION_CHANGED` action.
 */
function isRouterLocationChangedAction(value: unknown): value is RouterLocationChangedAction {
    const action = value as RouterLocationChangedAction;
    return !!action && action.type === ROUTER_LOCATION_CHANGED && isRouterState(action.payload);
}

/**
 * 判断一个值是否为合法的 RouterState。
 *
 * Checks whether a value is a valid `RouterState`.
 */
function isRouterState(value: unknown): value is RouterState {
    const state = value as RouterState;
    return !!state && isLocationLike(state.location) && isHistoryAction(state.action);
}

/**
 * 判断一个值是否具备 Location 的核心字段。
 *
 * Checks whether a value contains the core fields required for a `Location`.
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
 *
 * Accepts only standard history actions.
 */
function isHistoryAction(value: unknown): value is Action {
    return value === "POP" || value === "PUSH" || value === "REPLACE";
}

/**
 * 规范化 action，不支持的值直接抛错。
 *
 * Normalizes an action and throws if the value is unsupported.
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
 *
 * Normalizes a `RouterState`.
 * Reuses the object directly if it is already a normalized snapshot.
 */
function normalizeRouterState(state: RouterState, freezeSnapshots: boolean): RouterState {
    if (isNormalizedRouterState(state)) {
        return state;
    }

    return createNormalizedRouterState(state.location, state.action, freezeSnapshots);
}

/**
 * 创建标准化后的 RouterState。
 *
 * Creates a normalized `RouterState`.
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
 *
 * Checks whether a `RouterState` has already been marked as normalized by this bridge.
 */
function isNormalizedRouterState(value: unknown): boolean {
    return !!value && typeof value === "object" && normalizedRouterStateRegistry.has(value as object);
}

/**
 * 对 ROUTER_NAVIGATE 的 payload 做统一校验和标准化。
 *
 * Validates and normalizes the payload of `ROUTER_NAVIGATE`.
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
 *
 * Checks whether a value can be used as a navigation target `To`.
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
 *
 * Normalizes a `To` value.
 * String values are reused directly, while object values are optionally frozen based on configuration.
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
 *
 * Extracts the target object needed by `history.push/replace` from a `Location`.
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
 * 为什么需要克隆：
 * 1. history.location 是外部对象，bridge 不应直接把它裸放进 Redux
 * 2. 如果 Redux 与 history 共用同一份 location/state 引用，业务误改会污染同步基准
 * 3. clone 后 bridge 才能把 Redux 中的 router 当作独立快照使用
 * 如果完全不克隆，常见问题是：
 * - router.location 被外部意外修改
 * - bridge 的相等判断失真
 * - Redux 调试里看到的路由状态与真实导航过程不一致
 * 注意：
 * - 这里不强制冻结，默认尽量不让业务误改时抛错
 * - 是否冻结由 freezeSnapshots 控制
 *
 * Normalizes a `Location` into a snapshot object.
 * Why cloning is needed:
 * 1. `history.location` is an external object and should not be stored in Redux by reference
 * 2. sharing the same location/state reference between Redux and history lets accidental mutations corrupt the sync baseline
 * 3. cloning lets the bridge treat the router state in Redux as an isolated snapshot
 * Common problems if no cloning happens at all:
 * - `router.location` can be mutated from the outside
 * - equality checks become unreliable
 * - Redux DevTools may show route state that no longer matches actual navigation
 * Notes:
 * - snapshots are not frozen by default so application mistakes are less likely to throw immediately
 * - freezing behavior is controlled by `freezeSnapshots`
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
 *
 * Checks whether a `Location` has already been normalized.
 */
function isNormalizedLocation(value: unknown): boolean {
    return !!value && typeof value === "object" && normalizedLocationRegistry.has(value as object);
}
/**
 * 克隆 bridge 支持的 state 类型。
 * 只处理：
 * - 数组
 * 其它复杂对象（Date / Map / Set / 类实例 / DOM 等）直接原样返回。
 * `seen` 用于处理循环引用。
 *
 * Clones state shapes supported by the bridge.
 * Supported inputs:
 * - primitive
 * - primitive values
 * - arrays
 * - plain object
 * - plain objects
 * Other complex objects (Date / Map / Set / class instances / DOM nodes, etc.) are returned as-is.
 * `seen` is used to handle circular references.
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
 *
 * Checks whether a value is primitive.
 */
function isPrimitiveStateValue(value: unknown): boolean {
    return value === null || (typeof value !== "object" && typeof value !== "function");
}

/**
 * 判断一个值是否为 plain object。
 *
 * Checks whether a value is a plain object.
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
 *
 * Shallow-freezes an object.
 */
function freezeShallow<T extends object>(value: T): T {
    return Object.freeze(value);
}

/**
 * 根据配置决定是否冻结快照对象。
 * 默认不冻结，这样业务代码误改 router 状态时尽量不报错；
 * 如果你希望更早暴露误改问题，可把 freezeSnapshots 设为 true。
 *
 * Decides whether a snapshot object should be frozen based on configuration.
 * By default snapshots are not frozen so application code is less likely to throw on accidental mutation.
 * Set `freezeSnapshots` to `true` if you want mutation problems to surface earlier.
 */
function finalizeSnapshot<T extends object>(value: T, freezeSnapshots: boolean): T {
    return freezeSnapshots ? freezeShallow(value) : value;
}

/**
 * 默认的 Location 相等判断策略。
 * 顺序是：
 * 1. 先比较 pathname/search/hash/key
 * 2. 再比较 state 引用
 * 3. 必要时按 compareStateMode 决定做浅比较还是深比较 state
 *
 * Default equality strategy for `Location` objects.
 * Comparison order:
 * 1. compare pathname/search/hash/key first
 * 2. then compare state references
 * 3. if needed, use `compareStateMode` to choose shallow or deep state comparison
 */
function locationsEqual(a: Location, b: Location, compareStateMode: StateCompareMode = "smart"): boolean {
    return (
        a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && stateEquals(a.state, b.state, compareStateMode)
    );
}

/**
 * 判断两个 state 是否属于 bridge 可比较的结构化类型。
 * 只有下面两类才进入后续浅/深比较：
 * - 数组 <-> 数组
 * 像 Date / Map / Set / 类实例这类复杂对象不做结构比较。
 *
 * Checks whether both state values are structured types supported by the bridge.
 * Only the following pairs enter shallow/deep comparison:
 * - array <-> array
 * - plain object <-> plain object
 * - plain object <-> plain object
 * Complex objects such as Date / Map / Set / class instances are not structurally compared.
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
 * 这个函数用于 `smart` 模式。
 *
 * Performs a one-level shallow comparison for supported structured state values.
 * This function is used by the `smart` mode.
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
 *
 * Chooses the state comparison strategy based on `compareStateMode`.
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
 *
 * Deep-compares supported structured state values with circular-reference protection.
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
 *
 * Records object pairs that have already been compared to avoid infinite recursion from circular references.
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
