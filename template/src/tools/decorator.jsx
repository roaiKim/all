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

export function Auth(auth) {
    return createActionHandlerDecorator((handler, rootState) => {
        // 这里可以通过权限判断, rootState 是整个 redux 的 state。也可以把权限数据写入 window 变量中
        const pass = true; // rootState?.app?.main?.auth?.include(auth);
        if (pass) {
            return handler();
        } else {
            console.log("暂无权限");
        }
    });
}
