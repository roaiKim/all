/**
 * @description loading
 * @param identifier loading的标识 用于区分不同的loading, 取值时 showLoading 的第二个参数
 * @returns
 */
export declare function loading(identifier?: string): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<import("../module").ActionHandler>) => TypedPropertyDescriptor<import("../module").ActionHandler>;
/**
 * @description module中 onTick 函数的执行周期
 * @param second 间隔的秒数
 * @returns
 */
export declare function interval(second: number): (target: any, propertyKey: any, descriptor: any) => any;
/**
 * @description 互斥锁
 * @returns null
 */
export declare function mutex(): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<import("../module").ActionHandler>) => TypedPropertyDescriptor<import("../module").ActionHandler>;
/**
 * @description 遇到出错时 自动重试
 * @param retryIntervalSecond 重试的间隔数
 * @param timesBlock 重试的次数
 * @returns null
 */
export declare function retryOnNetworkConnectionError(retryIntervalSecond?: number, timesBlock?: number): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<import("../module").ActionHandler>) => TypedPropertyDescriptor<import("../module").ActionHandler>;
