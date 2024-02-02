import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { app } from "../app";
import { captureError } from "../util/error-util";
import { ErrorBoundary } from "../util/ErrorBoundary";
export var LOGGER_ACTION = "@@framework/logger";
export var VERSION_CHECK_ACTION = "@@framework/version-check";
export var GLOBAL_ERROR_ACTION = "@@framework/global";
export var GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";
export function bootstrap(option) {
    var _a;
    setupGlobalErrorHandler(option.errorListener);
    setupLocationChangeListener((_a = option.browserConfig) === null || _a === void 0 ? void 0 : _a.onLocationChange);
    renderRoot(option.componentType, option.rootContainer || injectRootContainer());
}
function setupGlobalErrorHandler(errorListener) {
    if (errorListener) {
        app.errorHandler = errorListener.onError.bind(errorListener);
    }
    window.addEventListener("error", function (event) {
        // event.preventDefault();
        try {
            var analyzeByTarget = function () {
                if (event.target && event.target !== window) {
                    var element = event.target;
                    return "DOM source error: ".concat(element.outerHTML);
                }
                return "Unrecognized error, serialized as ".concat(JSON.stringify(event));
            };
            captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
        }
        catch (e) {
            //
        }
    }, true);
    window.addEventListener("unhandledrejection", function (event) {
        // event.preventDefault();
        try {
            captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
        }
        catch (e) {
            //
        }
    }, true);
}
function renderRoot(EntryComponent, rootContainer) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(_jsx(Provider, __assign({ store: app.store }, { children: _jsx(ConnectedRouter, __assign({ history: app.browserHistory }, { children: _jsx(ErrorBoundary, { children: _jsx(EntryComponent, {}) }) })) })), rootContainer);
}
function injectRootContainer() {
    var rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
function setupLocationChangeListener(listener) {
    if (listener) {
        app.browserHistory.listen(listener);
    }
}
//# sourceMappingURL=bootstrap.js.map