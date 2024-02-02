// 这里的装饰器只能用于 module 中的方法

import { app } from "../app";
import { NetworkConnectionException } from "../Exception";
import { loadingAction } from "../reducer";

import { createActionHandlerDecorator } from ".";

/**
 * @description loading
 * @param identifier loading的标识 用于区分不同的loading, 取值时 showLoading 的第二个参数
 * @returns
 */
export function loading(identifier = "global") {
    return createActionHandlerDecorator(async (handler) => {
        try {
            app.store.dispatch(loadingAction(true, identifier));
            await handler();
        } finally {
            app.store.dispatch(loadingAction(false, identifier));
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
