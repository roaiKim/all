import { createActionHandlerDecorator } from "./index";

export function Mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(async function (handler) {
        if (lockTime) {
            //
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
