import { connectRouter } from "connected-react-router";
import { Action as ReduxAction, combineReducers } from "redux";
import { app } from "./app";
import { History } from "history";
import { State, WebsiteState, LoadingState } from "./type";

export interface Action<P> extends ReduxAction<string> {
    name?: string;
    payload: P;
}

// app
interface SetStateActionPayload {
    module: string;
    state: any;
}
const SET_STATE_ACTION = "@@framework/setState";
export function setStateAction(module: string, state: object, type: string): Action<SetStateActionPayload> {
    return {
        type,
        name: SET_STATE_ACTION,
        payload: { module, state },
    };
}
function setStateReducer(state: State["app"] = {}, action: Action<SetStateActionPayload>): State["app"] {
    if (action.name === SET_STATE_ACTION) {
        const { module, state: moduleState } = action.payload;
        return { ...state, [module]: { ...state[module], ...moduleState } };
    }
    return state;
}

// loading
interface LoadingActionPayload {
    identifier: string;
    show: boolean;
}
export const LOADING_ACTION = "@@framework/loading";
export function loadingAction(show: boolean, identifier = "global"): Action<LoadingActionPayload> {
    return {
        type: LOADING_ACTION,
        payload: { identifier, show },
    };
}
function loadingReducer(state: LoadingState = {}, action: Action<LoadingState>): LoadingState {
    if (action.type === LOADING_ACTION) {
        const { payload } = action;
        const count = state[payload.identifier] || 0;
        return {
            ...state,
            [payload.identifier]: count + (payload.show ? 1 : -1),
        };
    }
    return state;
}

// website
export const WEBSITE_ACTION = "@@framework/setWebsite";
export function websiteAction(website: WebsiteState): Action<WebsiteState> {
    return {
        type: WEBSITE_ACTION,
        payload: {
            ...website,
        },
    };
}
function websiteReducer(state: WebsiteState = {}, action: Action<WebsiteState>) {
    if (action.type === WEBSITE_ACTION) {
        const { payload } = action;
        return {
            ...state,
            ...payload,
        };
    }
    return state;
}

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

export function rootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        loading: loadingReducer,
        website: websiteReducer,
        app: setStateReducer,
        navigationPrevented: navigationPreventionReducer,
    });
}

export function showLoading(state: State, identifier = "global") {
    return state.loading[identifier] > 0;
}

export const executeMethodMiddleware = () => (next: any) => (action: Action<any>) => {
    const result = next(action);
    const handler = app.actionHandlers[action.type];
    if (handler) {
        handler(...action.payload);
    }
    return result;
};
