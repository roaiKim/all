import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Location } from "history";
import { ConnectedRouter } from "connected-react-router";
import { NavigationGuard } from "./NavigationGuard";
import { app } from "../app";
// import { ajax } from "../util/network";
import { APIException } from "../Exception";
import { LoggerConfig } from "../logger";
import { ErrorListener } from "../module";
import { captureError, errorToException } from "../util/error-util";
import { ErrorBoundary } from "../util/ErrorBoundary";
import { isIEBrowser } from "../util/navigator-util";

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
    loggerConfig?: LoggerConfig;
}

export const LOGGER_ACTION = "@@framework/logger";
export const VERSION_CHECK_ACTION = "@@framework/version-check";
export const GLOBAL_ERROR_ACTION = "@@framework/global";
export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";

export function bootstrap(option: BootstrapOption): void {
    // detectIEBrowser(option.browserConfig?.onIE);
    setupGlobalErrorHandler(option.errorListener);
    // setupAppExitListener(option.loggerConfig?.serverURL);
    setupLocationChangeListener(option.browserConfig?.onLocationChange);
    // runBackgroundLoop(option.loggerConfig);
    renderRoot(
        option.componentType,
        option.rootContainer || injectRootContainer(),
        option.browserConfig?.navigationPreventionMessage || "Are you sure to leave current page?"
    );
}

function detectIEBrowser(onIE?: () => void) {
    if (isIEBrowser()) {
        if (onIE) {
            onIE();
        } else {
            let ieAlertMessage: string;
            const navigatorLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
            if (navigatorLanguage.startsWith("zh")) {
                ieAlertMessage = "对不起，本网站不支持 IE 浏览器\n请使用 Chrome/Firefox/360 浏览器再访问";
            } else {
                ieAlertMessage = "This website does not support IE browser.\nPlease use Chrome/Safari/Firefox to visit.\nSorry for the inconvenience.";
            }
            alert(ieAlertMessage);
        }
    }
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
                /**
                 * This should not happen normally.
                 * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
                 * A typical example is: Permission denied to access property `foo`
                 */
                app.logger.warn({
                    action: GLOBAL_ERROR_ACTION,
                    errorCode: "ERROR_HANDLER_FAILURE",
                    errorMessage: errorToException(e).message,
                    elapsedTime: 0,
                    info: {},
                });
            }
        },
        true
    );
    window.addEventListener(
        "unhandledrejection",
        (event) => {
            // event.preventDefault();
            // const msg = event.reason;
            // console.log(`%c${JSON.stringify(msg, null, 4)}`, "color: red");
            try {
                captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            } catch (e) {
                app.logger.warn({
                    action: GLOBAL_PROMISE_REJECTION_ACTION,
                    errorCode: "ERROR_HANDLER_FAILURE",
                    errorMessage: errorToException(e).message,
                    elapsedTime: 0,
                    info: {},
                });
            }
        },
        true
    );
}

function renderRoot(EntryComponent: React.ComponentType, rootContainer: HTMLElement, navigationPreventionMessage: string) {
    ReactDOM.render(
        <Provider store={app.store}>
            <ConnectedRouter history={app.browserHistory}>
                {/* <NavigationGuard message={navigationPreventionMessage} /> */}
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

function setupAppExitListener(eventServerURL?: string) {
    if (eventServerURL) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        window.addEventListener(
            // Ref: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
            isIOS ? "pagehide" : "unload",
            () => {
                try {
                    app.logger.info({ action: "@@EXIT" });
                    const logs = app.logger.collect();
                    /**
                     * navigator.sendBeacon() uses HTTP POST, but does not support CORS.
                     * We have to use text/plain as content type, instead of JSON.
                     */
                    const textData = JSON.stringify({ events: logs });
                    navigator.sendBeacon(eventServerURL, textData);
                } catch (e) {
                    // Silent if sending error
                }
            },
            false
        );
    }
}

function setupLocationChangeListener(listener?: (location: Location) => void) {
    if (listener) {
        app.browserHistory.listen(listener);
    }
}

async function runBackgroundLoop(loggerConfig?: LoggerConfig) {
    app.logger.info({ action: "@@ENTER" });
    app.loggerConfig = loggerConfig || null;
    let timer = null;
    if (loggerConfig) {
        while (true) {
            // yield delay((loggerConfig.frequencyInSecond || 20) * 1000);
            // yield* call(sendEventLogs);
            await new Promise((resolve, reject) => {
                timer = setTimeout(resolve, (loggerConfig.frequencyInSecond || 20) * 1000);
            });
            await sendEventLogs();
        }
    }
}

export async function sendEventLogs(): Promise<void> {
    if (app.loggerConfig) {
        const logs = app.logger.collect(200);
        const logLength = logs.length;
        if (logLength > 0) {
            try {
                /**
                 * Event server URL may be different from current domain (supposing abc.com)
                 *
                 * In order to support this, we must ensure:
                 * - Event server allows cross-origin request from current domain
                 * - Root-domain cookies, whose domain is set by current domain as ".abc.com", can be sent (withCredentials = true)
                 */
                // await ajax("POST", app.loggerConfig.serverURL, {}, { events: logs }, { withCredentials: true });
                app.logger.emptyLastCollection();
            } catch (e) {
                if (e instanceof APIException) {
                    // For APIException, retry always leads to same error, so have to give up
                    // Do not log network exceptions
                    app.logger.emptyLastCollection();
                    app.logger.exception(e, { droppedLogs: logLength.toString() }, LOGGER_ACTION);
                }
            }
        }
    }
}
