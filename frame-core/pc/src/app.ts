import { createBrowserHistory, type History } from "history";
import { applyMiddleware, compose, createStore, type Store, type StoreEnhancer } from "redux";
import { createReduxHistoryContext } from "redux-first-history";
import { type Logger, type LoggerConfig, LoggerImpl } from "./logger";
import { type ActionHandler, type ErrorHandler } from "./module";
import { executeMethodMiddleware, LOADING_ACTION, rootReducer, type State } from "./reducer";

declare const window: any;

interface App {
    readonly browserHistory: History;
    readonly store: Store<State>;
    readonly actionHandlers: { [actionType: string]: ActionHandler };
    readonly logger: LoggerImpl;
    loggerConfig: LoggerConfig | null;
    errorHandler: ErrorHandler;
}

export const app = createApp();
export const logger: Logger = app.logger;

function composeWithDevTools(enhancer: StoreEnhancer): StoreEnhancer {
    let composeEnhancers = compose;
    // @ts-ignore
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
    const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
        history: createBrowserHistory(),
    });

    const eventLogger = new LoggerImpl();

    const store: Store<State> = createStore(rootReducer(routerReducer), composeWithDevTools(applyMiddleware(routerMiddleware, executeMethodMiddleware)));
    const browserHistory = createReduxHistory(store);

    return {
        browserHistory,
        store,
        actionHandlers: {},
        logger: eventLogger,
        loggerConfig: null,
        *errorHandler() {},
    };
}
