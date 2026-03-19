import { createBrowserHistory, type History } from "history";
import { applyMiddleware, compose, legacy_createStore as createStore, type Store, type StoreEnhancer } from "redux";
// import { createReduxHistoryContext } from "redux-first-history";
// import createSagaMiddleware, { type SagaMiddleware } from "redux-saga";
// import { call as rawCall, race as rawRace, take, takeEvery } from "redux-saga/effects";
import { createReduxHistory, createRouterMiddleware, createRouterReducer, type RouterState } from "./bridge/enhanced-v2";
import { type Logger, type LoggerConfig, LoggerImpl } from "./Logger";
import { type ActionHandler, type ErrorHandler, executeAction } from "./module";
import { type Action, LOADING_ACTION, rootReducer, type State } from "./reducer";
import { captureError } from "./util/error-util";
import { executeMethodMiddleware } from "./util/Middleware";

declare const window: any;

interface App {
    readonly history: History;
    readonly store: Store<State>;
    // readonly sagaMiddleware: SagaMiddleware<any>;
    readonly actionHandlers: { [actionType: string]: { handler: ActionHandler; moduleName: string } };
    readonly logger: LoggerImpl;
    loggerConfig: LoggerConfig | null;
    errorHandler: ErrorHandler;
}

export const app = createApp();
export const logger: Logger = app.logger;

function composeWithDevTools(enhancer: StoreEnhancer): StoreEnhancer {
    let composeEnhancers = compose;
    if (process.env.NODE_ENV === "development") {
        const extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (extension) {
            composeEnhancers = extension({
                // Ref: https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md#actionsdenylist--actionsallowlist
                actionsDenylist: [LOADING_ACTION],
            });
        }
    }
    return composeEnhancers(enhancer);
}

function createApp(): App {
    const history = createBrowserHistory();

    const store = createStore(
        rootReducer(createRouterReducer(history)),
        composeWithDevTools(applyMiddleware(createRouterMiddleware(history), executeMethodMiddleware))
    ) as Store<State>;

    return {
        history,
        store,
        actionHandlers: {},
        logger: new LoggerImpl(),
        loggerConfig: null,
        errorHandler() {},
    };
}
