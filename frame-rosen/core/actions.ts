import { Action } from "redux";
import { push } from "redux-first-history";
import { app } from "./app";

export const roPushHistory = (urlOrState: Record<string, any> | string, state?: object | "keep-state") => {
    if (typeof urlOrState === "string") {
        // 只能相对于根路径进行跳转
        const url: string = urlOrState.startsWith("/") ? urlOrState : `/${urlOrState}`;
        if (state) {
            app.store.dispatch(push(url, state === "keep-state" ? app.browserHistory.location.state : state));
        } else {
            app.store.dispatch(push(url));
        }
    } else {
        const currentURL = location.pathname + location.search;
        const state: Record<string, any> = urlOrState;
        app.store.dispatch(push(currentURL, state));
    }
};

export function roDispatchFunction(action: (...args: any[]) => Action<any>) {
    if (typeof action !== "function") throw new Error("this.dispatch 的参数必须为 Function");
    app.store.dispatch(action());
}

export function roDispatchAction(action: Action<any>) {
    app.store.dispatch(action);
}
