import { Action } from "redux";
import { push } from "connected-react-router";
import { app } from "./app";

export const roPushHistory = (urlOrState: Record<string, any> | string, state?: object | "keep-state") => {
    if (typeof urlOrState === "string") {
        const url: string = urlOrState;
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

export function roDispatch(action: (...args: any[]) => Action<any>) {
    if (typeof action !== "function") throw new Error("this.dispatch 的参数必须为 Function");
    app.store.dispatch(action());
}
