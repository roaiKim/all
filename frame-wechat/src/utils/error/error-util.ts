import { ErrorHandler, Exception, JavaScriptException, roApp } from "@core";

export const LOGGER_ACTION = "@@framework/logger";
export const VERSION_CHECK_ACTION = "@@framework/version-check";
export const GLOBAL_ERROR_ACTION = "@@framework/global";
export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";
export const USER_ACTION = "@@user/promise-rejection";

let errorHandlerRunning = false;

export function errorToException(error: unknown): Exception {
    if (error instanceof Exception) {
        return error;
    } else {
        let message: string;
        if (!error) {
            message = "[No Message]";
        } else if (typeof error === "string") {
            message = error;
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            try {
                message = JSON.stringify(error);
            } catch (e) {
                message = "[Unknown]";
            }
        }
        return new JavaScriptException(message, error);
    }
}

const ignoreErrors = ["ResizeObserver loop limit exceeded"];

export function captureError(error: unknown, action = USER_ACTION): Exception {
    const exception = errorToException(error);

    const errorMessage = exception.message;
    const ignore = ignoreErrors.find((errorKey) => errorMessage.includes(errorKey));
    if (ignore) return;

    if (process.env.NODE_ENV === "development") {
        console.error(`[framework] Error captured from [${action}]`, error);
    }

    const errorStacktrace = error instanceof Error ? error.stack : undefined;
    const errorCode = specialErrorCode(exception, action, errorStacktrace);

    if (errorCode) {
        // app.logger
    } else {
        runUserErrorHandler(roApp.errorHandler, exception);
    }

    return exception;
}

export async function runUserErrorHandler(handler: ErrorHandler, exception: Exception) {
    // For app, report errors to event server ASAP, in case of sudden termination
    // sendEventLogs();
    if (errorHandlerRunning) return;

    try {
        errorHandlerRunning = true;
        await handler(exception);
    } catch (e) {
        console.warn("[framework] Fail to execute error handler", e);
    } finally {
        errorHandlerRunning = false;
    }
}

function specialErrorCode(exception: Exception, action: string, stacktrace?: string): string | null {
    const errorMessage = exception.message.toLowerCase();
    const ignoredPatterns = [
        // Network error while downloading JavaScript/CSS (webpack async loading)
        { pattern: "loading chunk", errorCode: "JS_CHUNK" },
        { pattern: "loading css chunk", errorCode: "CSS_CHUNK" },
        // CORS or CSP issues
        { pattern: "content security policy", errorCode: "CSP" },
        { pattern: "script error", errorCode: "CORS" },
        // Vendor injected, mostly still with stacktrace
        { pattern: "ucbrowser", errorCode: "VENDOR" },
        { pattern: "vivo", errorCode: "VENDOR" },
        { pattern: "huawei", errorCode: "VENDOR" },
        // Browser sandbox issues
        { pattern: "the operation is insecure", errorCode: "BROWSER_LIMIT" },
        { pattern: "access is denied for this document", errorCode: "BROWSER_LIMIT" },
    ];

    const matchedPattern = ignoredPatterns.find(({ pattern }) => errorMessage.includes(pattern));
    if (matchedPattern) {
        return `IGNORED_${matchedPattern.errorCode}_ISSUE`;
    }
    if (exception instanceof JavaScriptException && !isValidStacktrace(stacktrace) && [GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION].includes(action)) {
        return "IGNORED_UNCATEGORIZED_ISSUE";
    }
    if (action === GLOBAL_ERROR_ACTION && stacktrace && errorMessage.includes("'offsetwidth' of null") && stacktrace.includes("Array.forEach")) {
        // This is a known Ant Design Tabs issue
        return "IGNORED_ANTD_TAB_ISSUE";
    }
    if (action === GLOBAL_ERROR_ACTION && errorMessage.includes("'forcepopupalign' of null")) {
        // This is a known Ant Design Slider issue
        return "IGNORED_ANTD_SLIDER_ISSUE";
    }
    return null;
}

function isValidStacktrace(stacktrace?: string): boolean {
    if (stacktrace) {
        const ignoredPatterns = ["chrome-extension://"];
        if (ignoredPatterns.some((_) => stacktrace.includes(_))) {
            return false;
        }

        /**
         * Use fuzzy search, instead of document.querySelectorAll("script") to get all script tag URLs.
         *
         * The reason is, in latest webpack, the code-split chunk script is just injected and then removed.
         * In other words, the <script> tag only exists temporarily, not persisted in the DOM.
         */
        return stacktrace.includes(".js");
    }
    return false;
}
