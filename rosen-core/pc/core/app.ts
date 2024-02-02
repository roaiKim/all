import { createBrowserHistory, createHashHistory, History } from "history";
import { applyMiddleware, compose, createStore, Store, StoreEnhancer } from "redux";
import { routerMiddleware } from "connected-react-router";
import { ActionHandler, ErrorHandler } from "./module";
import { executeMethodMiddleware, LOADING_ACTION, rootReducer, State } from "./reducer";

declare const window: any;

interface App {
    readonly browserHistory: History;
    readonly store: Store<State>;
    readonly actionHandlers: { [actionType: string]: ActionHandler };
    errorHandler: ErrorHandler;
}

export const app = createApp();

function composeWithDevTools(enhancer: StoreEnhancer): StoreEnhancer {
    let composeEnhancers = compose;
    if (process.env.NODE_ENV === "development") {
        const extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (extension) {
            composeEnhancers = extension({
                // Ref: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
                actionsDenylist: [LOADING_ACTION],
            });
        }
    }
    return composeEnhancers(enhancer);
}

function createApp(): App {
    const browserHistory = createHashHistory();

    const store: Store<State> = createStore(
        rootReducer(browserHistory),
        composeWithDevTools(applyMiddleware(routerMiddleware(browserHistory), executeMethodMiddleware))
    );

    return {
        browserHistory,
        store,
        actionHandlers: {},
        *errorHandler() {},
    };
}
