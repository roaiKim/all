import { applyMiddleware, compose, legacy_createStore as createStore, Store } from "redux";
import { ActionHandler } from "./module";
import { rootReducer, State, executeMethodMiddleware } from "./reducer";

interface App {
    readonly store: Store<State>;
    readonly actionHandlers: { [actionType: string]: ActionHandler };
}

export const app = createApp();

function createApp(): App {
    const store: Store<State> = createStore(rootReducer(), compose(applyMiddleware(executeMethodMiddleware)));

    return {
        store,
        actionHandlers: {},
    };
}
