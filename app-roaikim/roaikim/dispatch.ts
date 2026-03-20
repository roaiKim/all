import type { UnknownAction } from "redux";
import { app } from "./app";

export function dispatchFunctionAction(action: (...args: any[]) => UnknownAction) {
    if (typeof action !== "function") throw new Error("dispatchFunctionAction 的参数必须为 Function");
    app.store.dispatch(action());
}

export function dispatchAction(action: UnknownAction) {
    app.store.dispatch(action);
}
