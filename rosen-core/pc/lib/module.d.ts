import { Exception } from "./Exception";
import { Module, ModuleLifecycleListener } from "./platform/Module";
import { ModuleProxy } from "./platform/ModuleProxy";
import { Action } from "./reducer";
export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}
export interface ErrorListener {
    onError: ErrorHandler;
}
export type ActionHandler = (...args: any[]) => any;
export type ErrorHandler = (error: Exception) => unknown;
type ActionCreator<H> = H extends (...args: infer P) => unknown ? (...args: P) => Action<P> : never;
type HandlerKeys<H> = {
    [K in keyof H]: H[K] extends (...args: any[]) => unknown ? K : never;
}[Exclude<keyof H, keyof ModuleLifecycleListener | keyof ErrorListener>];
export type ActionCreators<H> = {
    readonly [K in HandlerKeys<H>]: ActionCreator<H[K]>;
};
export declare function register<M extends Module<any, any>>(module: M): ModuleProxy<M>;
export declare function executeAction(actionName: string, handler: ActionHandler, ...payload: any[]): Promise<void>;
export {};
