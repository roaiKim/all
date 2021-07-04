import { createActionHandlerDecorator } from "core";
import { createPromisedConfirmation } from "./ui/modal";

export function WithConfirm(text) {
    return createActionHandlerDecorator(async (handler) => {
        const result = await createPromisedConfirmation(text);
        if (result === "ok") {
            handler();
        }
    });
}
