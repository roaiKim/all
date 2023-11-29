import { createActionHandlerDecorator } from "./index";
import { app } from "../app";

export function Mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(async function (handler) {
        if (lockTime) {
            app.logger.info({
                action: handler.actionName,
                info: {
                    payload: handler.maskedParams,
                    mutex_locked_duration: (Date.now() - lockTime).toString(),
                },
            });
        } else {
            try {
                lockTime = Date.now();
                await handler();
            } finally {
                lockTime = null;
            }
        }
    });
}
