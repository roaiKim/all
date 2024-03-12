import { type Action as ReduxAction, combineReducers, type Reducer } from "redux";
import { type RouterState } from "redux-first-history";
import { app } from "./app";

// Redux State
interface LoadingState {
    [loading: string]: number;
}

export interface State {
    loading: LoadingState;
    router: RouterState;
    navigationPrevented: boolean;
    app: object;
}

// Redux Action
const SET_STATE_ACTION = "@@framework/setState";

export interface Action<P> extends ReduxAction<string> {
    payload: P;
    name?: typeof SET_STATE_ACTION;
}

// Redux Action: SetState (to update state.app)
interface SetStateActionPayload {
    module: string;
    state: any;
}

// state must be complete module state, not partial
export function setStateAction(module: string, state: object, type: string): Action<SetStateActionPayload> {
    return {
        type,
        name: SET_STATE_ACTION,
        payload: { module, state },
    };
}

function setStateReducer(state: State["app"] = {}, action: Action<any>): State["app"] {
    // Use action.name for set state action, make type specifiable to make tracking/tooling easier
    if (action.name === SET_STATE_ACTION) {
        const { module, state: moduleState } = action.payload as SetStateActionPayload;
        return { ...state, [module]: moduleState };
    }
    return state;
}

// Redux Action: Loading (to update state.loading)
interface LoadingActionPayload {
    identifier: string;
    show: boolean;
}

// Redux Action: Loading (to update state.loading)
interface PageLoadingActionPayload {
    identifier: string;
    type: 0 | 1 | 2; // 0 正在不在loading, 1在loading 3loading 错误
}

/**
 * 普通的 loading
 */
export const LOADING_ACTION = "@@framework/loading";
export function loadingAction(show: boolean, identifier: string = "global"): Action<LoadingActionPayload> {
    return {
        type: LOADING_ACTION,
        payload: { identifier, show },
    };
}

/**
 * @description 用于 page 的loading
 */
export const PAGE_LOADING_ACTION = "@@framework/page-loading";
export function pageLoadingAction(type: PageLoadingActionPayload["type"], identifier: string = "global"): Action<PageLoadingActionPayload> {
    return {
        type: PAGE_LOADING_ACTION,
        payload: { identifier, type },
    };
}

function loadingReducer(state: LoadingState = {}, action: Action<LoadingActionPayload | PageLoadingActionPayload>): LoadingState {
    if (action.type === LOADING_ACTION) {
        const payload = action.payload as LoadingActionPayload;
        const count = state[payload.identifier] || 0;
        return {
            ...state,
            [payload.identifier]: count + (payload.show ? 1 : -1),
        };
    } else if (action.type === PAGE_LOADING_ACTION) {
        const payload = action.payload as PageLoadingActionPayload;
        return {
            ...state,
            [payload.identifier]: payload.type,
        };
    }
    return state;
}

// Redux Action: Navigation Prevent (to update state.navigationPrevented)
interface NavigationPreventionActionPayload {
    isPrevented: boolean;
}

const NAVIGATION_PREVENTION_ACTION = "@@framework/navigation-prevention";

export function navigationPreventionAction(isPrevented: boolean): Action<NavigationPreventionActionPayload> {
    return {
        type: NAVIGATION_PREVENTION_ACTION,
        payload: { isPrevented },
    };
}

function navigationPreventionReducer(state: boolean = false, action: Action<NavigationPreventionActionPayload>): boolean {
    if (action.type === NAVIGATION_PREVENTION_ACTION) {
        const payload = action.payload as NavigationPreventionActionPayload;
        return payload.isPrevented;
    }
    return state;
}

// Root Reducer
export function rootReducer(routerReducer: Reducer<RouterState>): Reducer<State> {
    return combineReducers<State>({
        router: routerReducer,
        loading: loadingReducer,
        app: setStateReducer,
        navigationPrevented: navigationPreventionReducer,
    });
}

// Helper function, to determine if show loading
export function showLoading(state: State, identifier: string = "global") {
    return state.loading[identifier] > 0;
}

// Helper function, to determine if show loading
export function showPageLoading(name: string, pageTable: string) {
    const identifier = `${name}-${pageTable}-page-loading`;
    return app.store.getState().loading[identifier] > 0;
}

// Helper function, to determine if show loading
export function showAdditionLoading(name: string, pageModal: string) {
    const identifier = `${name}-${pageModal}-addition-loading`;
    return app.store.getState().loading[identifier] > 0;
}

export const executeMethodMiddleware = () => (next: any) => (action: Action<any>) => {
    const result = next(action);
    const handler = app?.actionHandlers[action.type];
    if (handler) {
        handler(...action.payload);
    }
    return result;
};
