import React from "react";
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
    ReactDOM.render(React.createElement(Provider, { store: app.store },
        React.createElement(ConnectedRouter, { history: app.browserHistory },
            React.createElement(ErrorBoundary, null,
                React.createElement(EntryComponent, null)))), rootContainer);
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
// export async function sendEventLogs(): Promise<void> {
//     if (app.loggerConfig) {
//         const logs = app.logger.collect(200);
//         const logLength = logs.length;
//         if (logLength > 0) {
//             try {
//                 /**
//                  * Event server URL may be different from current domain (supposing abc.com)
//                  *
//                  * In order to support this, we must ensure:
//                  * - Event server allows cross-origin request from current domain
//                  * - Root-domain cookies, whose domain is set by current domain as ".abc.com", can be sent (withCredentials = true)
//                  */
//                 // await ajax("POST", app.loggerConfig.serverURL, {}, { events: logs }, { withCredentials: true });
//                 app.logger.emptyLastCollection();
//             } catch (e) {
//                 if (e instanceof APIException) {
//                     // For APIException, retry always leads to same error, so have to give up
//                     // Do not log network exceptions
//                     app.logger.emptyLastCollection();
//                     app.logger.exception(e, { droppedLogs: logLength.toString() }, LOGGER_ACTION);
//                 }
//             }
//         }
//     }
// }
//# sourceMappingURL=bootstrap.js.map