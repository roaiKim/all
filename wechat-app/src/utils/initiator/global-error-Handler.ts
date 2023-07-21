import { ErrorListener } from "@core";
import Taro from "@tarojs/taro";
import { app } from "core/app";
import { GLOBAL_PROMISE_REJECTION_ACTION, captureError } from "./error-util";

export function setupGlobalErrorHandler(errorListener?: ErrorListener) {
    if (errorListener) {
        app.errorHandler = errorListener.onError.bind(errorListener);
    }
    // window.addEventListener(
    //     "error",
    //     (event) => {
    //         // event.preventDefault();
    //         try {
    //             const analyzeByTarget = (): string => {
    //                 if (event.target && event.target !== window) {
    //                     const element = event.target as HTMLElement;
    //                     return `DOM source error: ${element.outerHTML}`;
    //                 }
    //                 return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
    //             };
    //             captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
    //         } catch (e) {
    //             /**
    //              * This should not happen normally.
    //              * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
    //              * A typical example is: Permission denied to access property `foo`
    //              */
    //             app.logger.warn({
    //                 action: GLOBAL_ERROR_ACTION,
    //                 errorCode: "ERROR_HANDLER_FAILURE",
    //                 errorMessage: errorToException(e).message,
    //                 elapsedTime: 0,
    //                 info: {},
    //             });
    //         }
    //     },
    //     true
    // );
    // window.addEventListener(
    //     "unhandledrejection",
    //     (event) => {
    //         // event.preventDefault();
    //         // const msg = event.reason;
    //         // console.log(`%c${JSON.stringify(msg, null, 4)}`, "color: red");
    //         try {
    //             captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
    //         } catch (e) {
    //             app.logger.warn({
    //                 action: GLOBAL_PROMISE_REJECTION_ACTION,
    //                 errorCode: "ERROR_HANDLER_FAILURE",
    //                 errorMessage: errorToException(e).message,
    //                 elapsedTime: 0,
    //                 info: {},
    //             });
    //         }
    //     },
    //     true
    // );
    Taro.onUnhandledRejection((event) => {
        // event.preventDefault();
        // const msg = event.reason;
        // console.log(`%c${JSON.stringify(msg, null, 4)}`, "color: red");
        try {
            captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            console.log("-----onUnhandledRejection======", event.reason);
        } catch (e) {
            // app.logger.warn({
            //     action: GLOBAL_PROMISE_REJECTION_ACTION,
            //     errorCode: "ERROR_HANDLER_FAILURE",
            //     errorMessage: errorToException(e).message,
            //     elapsedTime: 0,
            //     info: {},
            // });
        }
    });
    Taro.onError((event) => {
        // event.preventDefault();
        // const msg = event.reason;
        // console.log(`%c${JSON.stringify(msg, null, 4)}`, "color: red");
        try {
            // captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            console.log("-----onError======", event);
        } catch (e) {
            // app.logger.warn({
            //     action: GLOBAL_PROMISE_REJECTION_ACTION,
            //     errorCode: "ERROR_HANDLER_FAILURE",
            //     errorMessage: errorToException(e).message,
            //     elapsedTime: 0,
            //     info: {},
            // });
        }
    });
}
