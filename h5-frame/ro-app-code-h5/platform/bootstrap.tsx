import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Location } from "history";
import { ConnectedRouter } from "connected-react-router";
import { app } from "../app";
import { ErrorListener } from "../module";
import { captureError } from "../util/error-util";
import { ErrorBoundary } from "../util/ErrorBoundary";

interface BrowserConfig {
    onIE?: () => void;
    onLocationChange?: (location: Location) => void;
    navigationPreventionMessage?: string;
}

interface BootstrapOption {
    componentType: React.ComponentType;
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
    browserConfig?: BrowserConfig;
}

export const LOGGER_ACTION = "@@framework/logger";
export const VERSION_CHECK_ACTION = "@@framework/version-check";
export const GLOBAL_ERROR_ACTION = "@@framework/global";
export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";

export function bootstrap(option: BootstrapOption): void {
    setupGlobalErrorHandler(option.errorListener);
    setupLocationChangeListener(option.browserConfig?.onLocationChange);
    renderRoot(option.componentType, option.rootContainer || injectRootContainer());
}

function setupGlobalErrorHandler(errorListener?: ErrorListener) {
    if (errorListener) {
        app.errorHandler = errorListener.onError.bind(errorListener);
    }
    window.addEventListener(
        "error",
        (event) => {
            // event.preventDefault();
            try {
                const analyzeByTarget = (): string => {
                    if (event.target && event.target !== window) {
                        const element = event.target as HTMLElement;
                        return `DOM source error: ${element.outerHTML}`;
                    }
                    return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                };
                captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
            } catch (e) {
                //
            }
        },
        true
    );
    window.addEventListener(
        "unhandledrejection",
        (event) => {
            // event.preventDefault();
            try {
                captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            } catch (e) {
                //
            }
        },
        true
    );
}

function renderRoot(EntryComponent: React.ComponentType, rootContainer: HTMLElement) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(
        <Provider store={app.store}>
            <ConnectedRouter history={app.browserHistory}>
                <ErrorBoundary>
                    <EntryComponent />
                </ErrorBoundary>
            </ConnectedRouter>
        </Provider>,
        rootContainer
    );
}

function injectRootContainer(): HTMLElement {
    const rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}

function setupLocationChangeListener(listener?: (location: Location) => void) {
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
