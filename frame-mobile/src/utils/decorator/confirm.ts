import { createActionHandlerDecorator } from "@core";
import { createPromisedConfirmation } from "./asyncActionHandler";

/**
 * @description 二次确认
 * @param text 显示文本
 * @returns null
 */
export function confirm(text: string) {
    return createActionHandlerDecorator(async (hander) => {
        const result = await createPromisedConfirmation(text);
        if (result === "ok") {
            hander();
        }
    });
}
