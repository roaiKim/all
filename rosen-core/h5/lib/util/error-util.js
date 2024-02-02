import { __awaiter, __generator } from "tslib";
import { app } from "../app";
import { Exception, JavaScriptException } from "../Exception";
import { GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION } from "../platform/bootstrap";
import { isIEBrowser } from "./navigator-util";
var errorHandlerRunning = false;
export function errorToException(error) {
    if (error instanceof Exception) {
        return error;
    }
    else {
        var message = void 0;
        if (!error) {
            message = "[No Message]";
        }
        else if (typeof error === "string") {
            message = error;
        }
        else if (error instanceof Error) {
            message = error.message;
        }
        else {
            try {
                message = JSON.stringify(error);
            }
            catch (e) {
                message = "[Unknown]";
            }
        }
        return new JavaScriptException(message, error);
    }
}
var ignoreErrors = ["ResizeObserver loop limit exceeded"];
export function captureError(error, action, extra) {
    if (action === void 0) { action = ""; }
    if (extra === void 0) { extra = {}; }
    var exception = errorToException(error);
    var errorMessage = exception.message;
    var ignore = ignoreErrors.find(function (errorKey) { return errorMessage.includes(errorKey); });
    if (ignore)
        return;
    if (process.env.NODE_ENV === "development") {
        console.error("[framework] Error captured from [".concat(action, "]"), error);
    }
    var errorStacktrace = error instanceof Error ? error.stack : undefined;
    var errorCode = specialErrorCode(exception, action, errorStacktrace);
    if (errorCode) {
        // app.logger.warn({
        //     action,
        //     elapsedTime: 0,
        //     info,
        //     errorMessage: exception.message,
        //     errorCode,
        // });
    }
    else {
        runUserErrorHandler(app.errorHandler, exception);
    }
    return exception;
}
export function runUserErrorHandler(handler, exception) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // For app, report errors to event server ASAP, in case of sudden termination
                    // sendEventLogs();
                    if (errorHandlerRunning)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    errorHandlerRunning = true;
                    return [4 /*yield*/, handler(exception)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.warn("[framework] Fail to execute error handler", e_1);
                    return [3 /*break*/, 5];
                case 4:
                    errorHandlerRunning = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function specialErrorCode(exception, action, stacktrace) {
    var errorMessage = exception.message.toLowerCase();
    var ignoredPatterns = [
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
    if (isIEBrowser()) {
        return "IE_BROWSER_ISSUE";
    }
    var matchedPattern = ignoredPatterns.find(function (_a) {
        var pattern = _a.pattern;
        return errorMessage.includes(pattern);
    });
    if (matchedPattern) {
        return "IGNORED_".concat(matchedPattern.errorCode, "_ISSUE");
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
function isValidStacktrace(stacktrace) {
    if (stacktrace) {
        var ignoredPatterns = ["chrome-extension://"];
        if (ignoredPatterns.some(function (_) { return stacktrace.includes(_); })) {
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
//# sourceMappingURL=error-util.js.map