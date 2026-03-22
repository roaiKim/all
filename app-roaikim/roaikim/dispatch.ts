import { routerNavigateAction } from "redux-router-bridge";
import type { UnknownAction } from "redux";
import { app } from "./app";

export function dispatchFunctionAction(action: (...args: any[]) => UnknownAction) {
    if (typeof action !== "function") throw new Error("dispatchFunctionAction 的参数必须为 Function");
    app.store.dispatch(action());
}

export function dispatchAction(action: UnknownAction) {
    app.store.dispatch(action);
}

function navigateTo<HistoryState extends object = object>(urlOrState: HistoryState | string, replace: boolean, state?: object | "keep-state") {
    if (typeof urlOrState === "string") {
        const url: string = urlOrState;
        if (state) {
            app.store.dispatch(routerNavigateAction(url, { state: state === "keep-state" ? app.history.location.state : state, replace }));
        } else {
            app.store.dispatch(routerNavigateAction(url), { replace });
        }
    } else {
        const currentURL = location.pathname + location.search;
        const state: HistoryState = urlOrState;
        app.store.dispatch(routerNavigateAction(currentURL, { state, replace }));
    }
}

export function pushHistory<HistoryState extends object = object>(urlOrState: HistoryState | string, state?: object | "keep-state") {
    return navigateTo(urlOrState, false, state);
}

export function replaceHistory<HistoryState extends object = object>(urlOrState: HistoryState | string, state?: object | "keep-state") {
    return navigateTo(urlOrState, true, state);
}
