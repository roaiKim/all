import { push } from "connected-react-router";
import { app } from "./app";
export var roPushHistory = function (urlOrState, state) {
    if (typeof urlOrState === "string") {
        // 只能相对于根路径进行跳转
        var url = urlOrState.startsWith("/") ? urlOrState : "/".concat(urlOrState);
        if (state) {
            app.store.dispatch(push(url, state === "keep-state" ? app.browserHistory.location.state : state));
        }
        else {
            app.store.dispatch(push(url));
        }
    }
    else {
        var currentURL = location.pathname + location.search;
        var state_1 = urlOrState;
        app.store.dispatch(push(currentURL, state_1));
    }
};
export function roDispatchFunction(action) {
    if (typeof action !== "function")
        throw new Error("this.dispatch 的参数必须为 Function");
    app.store.dispatch(action());
}
export function roDispatchAction(action) {
    app.store.dispatch(action);
}
//# sourceMappingURL=actions.js.map