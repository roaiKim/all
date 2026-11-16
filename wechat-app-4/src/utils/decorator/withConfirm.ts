import { createActionHandlerDecorator } from "@core";
import { createPromisedConfirmation } from "./asyncActionHandler";

export function withConfirm(text = "是否确认当前操作?") {
    return createActionHandlerDecorator(async (hander) => {
        const result = await createPromisedConfirmation(text);
        if (result === "ok") {
            hander();
        }
    });
}
