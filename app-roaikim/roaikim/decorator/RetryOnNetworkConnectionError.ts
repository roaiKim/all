// import { delay } from "redux-saga/effects";
import { createActionHandlerDecorator } from "./createActionHandlerDecorator";
import { app } from "../app";
import { NetworkConnectionException } from "../Exception";

/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 3, maxTime: number = 5) {
    return createActionHandlerDecorator(async function (handler) {
        let retryTime = 0;
        let timer;
        while (true) {
            if (retryTime > maxTime) {
                clearTimeout(timer);
                break;
            }
            try {
                await handler();
                clearTimeout(timer);
                break;
            } catch (e) {
                if (e instanceof NetworkConnectionException) {
                    retryTime++;
                    app.logger.exception(e, {
                        action: handler.actionName,
                        info: {
                            payload: handler.maskedParams,
                            process_method: `will retry #${retryTime}`,
                        },
                    });
                    await new Promise((resolve) => {
                        timer = setTimeout(resolve, retryIntervalSecond * 1000);
                    });
                } else {
                    throw e;
                }
            }
        }
    });
}
