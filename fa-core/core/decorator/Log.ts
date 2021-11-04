import { createActionHandlerDecorator } from "./index";

/**
 * To add a log item for action, with execution duration, action name, and masked action parameters.
 */
export function Log() {
    return createActionHandlerDecorator(async function (handler, thisModule) {
        const startTime = Date.now();
        try {
            await handler();
        } finally {
            thisModule.logger.info({
                action: handler.actionName,
                elapsedTime: Date.now() - startTime,
                info: { payload: handler.maskedParams },
            });
        }
    });
}
