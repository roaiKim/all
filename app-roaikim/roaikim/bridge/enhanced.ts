import type { Action, History, Location, To, Update } from "history";
import type { AnyAction, Middleware, Reducer, Store } from "redux";

export interface RouterState {
    location: Location;
    action: Action;
}

export const ROUTER_LOCATION_CHANGED = "@@redux-router/LOCATION_CHANGED";
export const ROUTER_NAVIGATE = "@@redux-router/NAVIGATE";

export interface RouterLocationChangedAction {
    type: typeof ROUTER_LOCATION_CHANGED;
    payload: RouterState;
}

export interface RouterNavigateAction {
    type: typeof ROUTER_NAVIGATE;
    payload: {
        to: To;
        replace?: boolean;
        state?: unknown;
    };
}

export type RouterAction = RouterLocationChangedAction | RouterNavigateAction;

export interface CreateReduxHistoryOptions<S = unknown> {
    selectRouterState?: (state: S) => RouterState;
    createLocationChangedAction?: (update: Update) => RouterLocationChangedAction;
    equalityFn?: (a: Location, b: Location) => boolean;
}

interface SyncRegistration {
    refCount: number;
    stop: () => void;
}

const syncRegistry = new WeakMap<History, WeakMap<Store<any, AnyAction>, SyncRegistration>>();

export const routerLocationChanged = (update: Update): RouterLocationChangedAction => ({
    type: ROUTER_LOCATION_CHANGED,
    payload: {
        location: cloneLocation(update.location),
        action: normalizeAction(update.action),
    },
});

export const routerNavigate = (to: To, options?: { replace?: boolean; state?: unknown }): RouterNavigateAction => ({
    type: ROUTER_NAVIGATE,
    payload: {
        to,
        replace: options?.replace,
        state: cloneState(options?.state),
    },
});

export const createRouterReducer = (initialState: RouterState): Reducer<RouterState, RouterAction> => {
    const normalizedInitialState = normalizeRouterState(initialState);

    return (state = normalizedInitialState, action) => {
        if (action.type !== ROUTER_LOCATION_CHANGED) {
            return state;
        }

        if (!isRouterLocationChangedAction(action)) {
            return state;
        }

        return normalizeRouterState(action.payload);
    };
};

export const createRouterMiddleware = (history: History): Middleware<object, any> => {
    assertHistory(history);

    return () => (next) => (action: AnyAction) => {
        if (action?.type !== ROUTER_NAVIGATE) {
            return next(action);
        }

        const payload = normalizeNavigatePayload(action.payload);
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
    const equalityFn = options.equalityFn ?? locationsEqual;
    let isDispatchingFromHistory = false;
    let lastRouterLocation: Location | null = null;

    const dispatchLocationChanged = (update: Update) => {
        const action = createLocationChangedAction({
            action: normalizeAction(update.action),
            location: cloneLocation(update.location),
        });

        if (!isRouterLocationChangedAction(action)) {
            throw new TypeError("createLocationChangedAction must return a valid ROUTER_LOCATION_CHANGED action");
        }

        const dispatchedAction = {
            ...action,
            payload: normalizeRouterState(action.payload),
        };

        isDispatchingFromHistory = true;
        store.dispatch(dispatchedAction as AnyAction);
        const syncedRouterState = selectRouterState(store.getState());
        lastRouterLocation = isRouterState(syncedRouterState) ? syncedRouterState.location : dispatchedAction.payload.location;
        isDispatchingFromHistory = false;
    };

    const unlisten = history.listen((update) => {
        dispatchLocationChanged(update);
    });

    dispatchLocationChanged({
        action: history.action,
        location: history.location,
    });

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
        const nextState = cloneState(routerState.location.state);
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

function getHistoryRegistry(history: History): WeakMap<Store<any, AnyAction>, SyncRegistration> {
    let historyRegistry = syncRegistry.get(history);
    if (!historyRegistry) {
        historyRegistry = new WeakMap<Store<any, AnyAction>, SyncRegistration>();
        syncRegistry.set(history, historyRegistry);
    }
    return historyRegistry;
}

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

function assertHistory(history: unknown): asserts history is History {
    if (!isHistoryLike(history)) {
        throw new TypeError("A valid history instance is required");
    }
}

function assertStore(store: unknown): asserts store is Store<any, AnyAction> {
    if (!isStoreLike(store)) {
        throw new TypeError("A valid Redux store is required");
    }
}

function isHistoryLike(value: unknown): value is History {
    const history = value as History;
    return !!history && typeof history.listen === "function" && typeof history.push === "function" && typeof history.replace === "function";
}

function isStoreLike(value: unknown): value is Store<any, AnyAction> {
    const store = value as Store<any, AnyAction>;
    return !!store && typeof store.getState === "function" && typeof store.dispatch === "function" && typeof store.subscribe === "function";
}

function isRouterLocationChangedAction(value: unknown): value is RouterLocationChangedAction {
    const action = value as RouterLocationChangedAction;
    return !!action && action.type === ROUTER_LOCATION_CHANGED && isRouterState(action.payload);
}

function isRouterState(value: unknown): value is RouterState {
    const state = value as RouterState;
    return !!state && isLocationLike(state.location) && isHistoryAction(state.action);
}

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

function isHistoryAction(value: unknown): value is Action {
    return value === "POP" || value === "PUSH" || value === "REPLACE";
}

function normalizeAction(action: unknown): Action {
    if (!isHistoryAction(action)) {
        throw new TypeError(`Unsupported history action: ${String(action)}`);
    }

    return action;
}

function normalizeRouterState(state: RouterState): RouterState {
    return {
        action: normalizeAction(state.action),
        location: cloneLocation(state.location),
    };
}

function normalizeNavigatePayload(payload: unknown): RouterNavigateAction["payload"] {
    const value = payload as RouterNavigateAction["payload"];
    if (!value || !isToLike(value.to)) {
        throw new TypeError("ROUTER_NAVIGATE requires a valid payload.to");
    }

    if (typeof value.replace !== "undefined" && typeof value.replace !== "boolean") {
        throw new TypeError("ROUTER_NAVIGATE payload.replace must be boolean when provided");
    }

    return {
        to: cloneTo(value.to),
        replace: value.replace,
        state: cloneState(value.state),
    };
}

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

function cloneTo(to: To): To {
    if (typeof to === "string") {
        return to;
    }

    return freezeShallow({
        pathname: to.pathname,
        search: to.search,
        hash: to.hash,
    });
}

function toHistoryTarget(location: Location): Exclude<To, string> {
    return {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
    };
}

function cloneLocation(location: Location): Location {
    return freezeShallow({
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        key: location.key,
        state: cloneState(location.state),
    }) as Location;
}

function cloneState<T>(value: T): T {
    if (Array.isArray(value)) {
        return freezeShallow(value.map((item) => cloneState(item))) as T;
    }

    if (isPlainObject(value)) {
        const clone: Record<string, unknown> = {};
        for (const [key, item] of Object.entries(value)) {
            clone[key] = cloneState(item);
        }
        return freezeShallow(clone) as T;
    }

    return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || typeof value !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function freezeShallow<T extends object>(value: T): T {
    return Object.freeze(value);
}

function locationsEqual(a: Location, b: Location): boolean {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && stateValuesEqual(a.state, b.state);
}

function stateValuesEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let index = 0; index < a.length; index += 1) {
            if (!stateValuesEqual(a[index], b[index])) {
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
            if (!Object.prototype.hasOwnProperty.call(b, key) || !stateValuesEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }

    return false;
}
