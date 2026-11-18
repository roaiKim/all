import { captureError, ErrorListener, GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION, roApp } from "@core";
import Taro from "@tarojs/taro";

export function setupGlobalErrorHandler(errorListener?: ErrorListener) {
    if (errorListener) {
        roApp.errorHandler = errorListener.onError.bind(errorListener);
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
