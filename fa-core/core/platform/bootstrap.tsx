import { ConnectedRouter } from "connected-react-router";
import React, { ComponentType } from "react";
import { Location } from "history";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { app } from "../app";
import { isIEBrowser } from "../util/navigator-util";
import { websiteAction } from "../reducer";
import { LoggerConfig } from "../logger";
import { ErrorListener } from "../module";

interface BrowserConfig {
    onIE?: () => void;
    onLocationChange?: (location: Location) => void;
    navigationPreventionMessage?: string;
}

interface BootstrapOption {
    entryComponent: ComponentType;
    errorListener: ErrorListener;
    rootContainer?: HTMLElement;
    browserConfig?: BrowserConfig;
    loggerConfig?: LoggerConfig;
    hasResize?: boolean;
}

export function bootstrap(option: BootstrapOption) {
    detectIEBrowser(option.browserConfig?.onIE);
    setupGlobalErrorHandler(option.errorListener);
    setupAppExitListener(option.loggerConfig?.serverURL);
    setupLocationChangeListener(option.browserConfig?.onLocationChange);
    renderRoot(option.entryComponent, option.rootContainer || injectRootContainer(), option.hasResize || false);
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
        // After that, the following code may still run
    }
}

function setupGlobalErrorHandler(errorListener: ErrorListener) {
    // app.errorHandler = errorListener.onError.bind(errorListener);
    window.addEventListener(
        "error",
        (event) => {
            try {
                // const analyzeByTarget = (): string => {
                //     if (event.target && event.target !== window) {
                //         const element = event.target as HTMLElement;
                //         return `DOM source error: ${element.outerHTML}`;
                //     }
                //     return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                // };
                // captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
            } catch (e) {
                /**
                 * This should not happen normally.
                 * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
                 * A typical example is: Permission denied to access property `foo`
                 */
                // app.logger.warn({
                //     action: GLOBAL_ERROR_ACTION,
                //     errorCode: "ERROR_HANDLER_FAILURE",
                //     errorMessage: errorToException(e).message,
                //     elapsedTime: 0,
                //     info: {},
                // });
            }
        },
        true
    );
    window.addEventListener(
        "unhandledrejection",
        (event) => {
            try {
                // captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            } catch (e) {
                // app.logger.warn({
                //     action: GLOBAL_PROMISE_REJECTION_ACTION,
                //     errorCode: "ERROR_HANDLER_FAILURE",
                //     errorMessage: errorToException(e).message,
                //     elapsedTime: 0,
                //     info: {},
                // });
            }
        },
        true
    );
}

function setupLocationChangeListener(listener?: (location: Location) => void) {
    if (listener) {
        app.browserHistory.listen(listener);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function windowResize() {
    const domHeight = document.body.offsetHeight;
    const domWidth = document.body.offsetWidth;
    app.store.dispatch(
        websiteAction({
            width: domWidth,
            height: domHeight,
        })
    );
}

function renderRoot(EntryComponent: ComponentType, rootContainer: HTMLElement, hasResize: boolean) {
    ReactDOM.render(
        <Provider store={app.store}>
            <ConnectedRouter history={app.browserHistory}>
                <EntryComponent />
            </ConnectedRouter>
        </Provider>,
        rootContainer,
        () => {
            if (hasResize) window.addEventListener("resize", windowResize);
        }
    );
}

function setupAppExitListener(eventServerURL?: string) {
    if (eventServerURL) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        window.addEventListener(
            // Ref: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
            isIOS ? "pagehide" : "unload",
            () => {
                try {
                    // app.logger.info({action: "@@EXIT"});
                    // const logs = app.logger.collect();
                    // /**
                    //  * navigator.sendBeacon() uses HTTP POST, but does not support CORS.
                    //  * We have to use text/plain as content type, instead of JSON.
                    //  */
                    // const textData = JSON.stringify({events: logs});
                    // navigator.sendBeacon(eventServerURL, textData);
                } catch (e) {
                    // Silent if sending error
                }
            },
            false
        );
    }
}

function injectRootContainer() {
    const rootContainer = document.createElement("div");
    rootContainer.id = "react-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
