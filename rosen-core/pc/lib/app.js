import { __generator } from "tslib";
import { createHashHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { executeMethodMiddleware, LOADING_ACTION, rootReducer } from "./reducer";
export var app = createApp();
function composeWithDevTools(enhancer) {
    var composeEnhancers = compose;
    if (process.env.NODE_ENV === "development") {
        var extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (extension) {
            composeEnhancers = extension({
                // Ref: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
                actionsDenylist: [LOADING_ACTION],
            });
        }
    }
    return composeEnhancers(enhancer);
}
function createApp() {
    var browserHistory = createHashHistory();
    var store = createStore(rootReducer(browserHistory), composeWithDevTools(applyMiddleware(routerMiddleware(browserHistory), executeMethodMiddleware)));
    return {
        browserHistory: browserHistory,
        store: store,
        actionHandlers: {},
        errorHandler: function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); },
    };
}
//# sourceMappingURL=app.js.map