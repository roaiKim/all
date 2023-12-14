import { createActionHandlerDecorator, loadingAction, NetworkConnectionException, pageLoadingAction, roDispatchAction } from "@core";
import { createPromisedConfirmation } from "./asyncActionHandler";

// 这里的装饰器只能用于 module 中的方法

/**
 * @description loading
 * @param identifier loading的标识 用于区分不同的loading, 取值时 showLoading 的第二个参数
 * @returns
 */
export function loading(identifier = "global") {
    return createActionHandlerDecorator(async (handler) => {
        try {
            roDispatchAction(loadingAction(true, identifier));
            await handler();
        } finally {
            roDispatchAction(loadingAction(false, identifier));
        }
    });
}

/**
 * @description page loading
 * @param identifier page loading的标识 用于区分不同的 page loading, 取值时 showPageLoading 的第二个参数
 * @returns
 */
export function pageLoading(pageTable = "main") {
    return createActionHandlerDecorator(async (handler, that) => {
        const name = that.name || "page";
        const identifier = `${name}-${pageTable}-page-loading`;
        let success = true;
        try {
            roDispatchAction(pageLoadingAction(1, identifier));
            await handler();
        } catch (e) {
            success = false;
            roDispatchAction(pageLoadingAction(2, identifier));
            throw e;
        } finally {
            if (success) {
                roDispatchAction(pageLoadingAction(0, identifier));
            }
        }
    });
}

/**
 * @description addition loading
 * @param identifier addition loading的标识 用于区分不同的 addition loading, 取值时 showAdditionLoading 的第二个参数
 * @returns
 */
export function additionLoading(pageTable = "main") {
    return createActionHandlerDecorator(async (handler, that) => {
        const name = that.name || "page";
        const identifier = `${name}-${pageTable}-addition-loading`;
        let success = true;
        try {
            roDispatchAction(pageLoadingAction(1, identifier));
            await handler();
        } catch (e) {
            success = false;
            roDispatchAction(pageLoadingAction(2, identifier));
            throw e;
        } finally {
            if (success) {
                roDispatchAction(pageLoadingAction(0, identifier));
            }
        }
    });
}

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

/**
 * @description module中 onTick 函数的执行周期
 * @param second 间隔的秒数
 * @returns
 */
export function interval(second: number) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.tickInterval = second;
        return descriptor;
    };
}

/**
 * @description 互斥锁
 * @returns null
 */
export function mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(async function (handler) {
        if (lockTime) {
            // app.logger.info({
            //     action: handler.actionName,
            //     info: {
            //         payload: handler.maskedParams,
            //         mutex_locked_duration: (Date.now() - lockTime).toString(),
            //     },
            // });
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

/**
 * @description 遇到出错时 自动重试
 * @param retryIntervalSecond 重试的间隔数
 * @param timesBlock 重试的次数
 * @returns null
 */
export function retryOnNetworkConnectionError(retryIntervalSecond: number = 3, timesBlock: number = 5) {
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
                    // app.logger.exception(
                    //     e,
                    //     {
                    //         payload: handler.maskedParams,
                    //         process_method: `will retry #${retryTime}`,
                    //     },
                    //     handler.actionName
                    // );
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
