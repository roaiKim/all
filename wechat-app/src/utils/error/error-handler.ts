import { ErrorListener } from "@core";
import Taro from "@tarojs/taro";
import { app } from "core/app";
import { GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION, captureError } from "./error-util";

export function setupGlobalErrorHandler(errorListener?: ErrorListener) {
    if (errorListener) {
        app.errorHandler = errorListener.onError.bind(errorListener);
    }
    Taro.onUnhandledRejection((event) => {
        try {
            captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
        } catch (e) {
            // app.logger
        }
    });
    Taro.onError((event: any) => {
        try {
            captureError(typeof event === "string" ? event : event?.error || event?.message, GLOBAL_ERROR_ACTION);
        } catch (e) {
            // app.logger
        }
    });
}
