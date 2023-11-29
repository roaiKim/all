import { createActionHandlerDecorator } from "./index";
import { app } from "../app";
import { NetworkConnectionException } from "../Exception";

export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 3, timesBlock: number = 5) {
    return createActionHandlerDecorator(async function (handler) {
        let retryTime = 0;
        let timer;
        while (true) {
            if (retryTime > timesBlock) {
                break;
            }
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
