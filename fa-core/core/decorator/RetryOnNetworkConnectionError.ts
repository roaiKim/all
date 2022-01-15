import { app } from "../app";
import { NetworkConnectionException } from "../allException";
import { createActionHandlerDecorator } from "./index";

/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 3) {
    return createActionHandlerDecorator(async function (handler) {
        let retryTime = 0;
        let timer;
        while (true) {
            try {
                await handler();
                break;
            } catch (e) {
                if (e instanceof NetworkConnectionException) {
                    retryTime++;
                    app.logger.exception(
                        e,
                        {
                            payload: handler.maskedParams,
                            process_method: `will retry #${retryTime}`,
                        },
                        handler.actionName
                    );
                    await new Promise((resolve, reject) => {
                        timer = setTimeout(resolve, retryIntervalSecond * 1000);
                    });
                } else {
                    throw e;
                }
            }
        }
    });
}
