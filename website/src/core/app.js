import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, compose } from 'redux';
import { rootReducer, executeMethodMiddleware, LOADING_ACTION } from './reducer';
function composeWithDevTools(enhancer) {
    let composeEnhancers = compose;
    if (process.env.NODE_ENV !== 'production') {
        const extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (extension) {
            composeEnhancers = extension({
                // Ref: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
                actionsBlacklist: [LOADING_ACTION],
            });
        }
    }
    return composeEnhancers(enhancer);
}
function createApp() {
    const browserHistory = createBrowserHistory();
    const store = createStore(rootReducer(browserHistory), composeWithDevTools(applyMiddleware(routerMiddleware(browserHistory), executeMethodMiddleware)));
    return {
        browserHistory,
        store,
        actionHandlers: {},
    };
}
export const app = createApp();
