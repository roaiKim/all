import { createActionHandlerDecorator } from "@core";
import { createPromisedConfirmation } from "./asyncActionHandler";

export function WithConfirm(text: string) {
    return createActionHandlerDecorator(async (hander) => {
        const result = await createPromisedConfirmation(text);
        if (result === "ok") {
            hander();
        }
    });
}
