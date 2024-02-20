import { applyMiddleware, compose, legacy_createStore as createStore, Store } from "redux";
import { Exception } from "./exception";
import { ActionHandler } from "./module";
import { executeMethodMiddleware, rootReducer, State } from "./reducer";

interface App {
    readonly store: Store<State>;
    readonly actionHandlers: { [actionType: string]: ActionHandler };
    errorHandler: (error: Exception) => unknown;
}

function createApp(): App {
    const store: Store<State> = createStore(rootReducer(), compose(applyMiddleware(executeMethodMiddleware)));

    return {
        store,
        actionHandlers: {},
        errorHandler() {},
    };
}

export const app = createApp();
export const roDispatch = app.store.dispatch;
