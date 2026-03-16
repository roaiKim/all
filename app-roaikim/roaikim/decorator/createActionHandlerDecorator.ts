import { app } from "../app";
import type { ActionHandler } from "../module";
import type { Module } from "../platform/Module";
import type { State } from "../reducer";
// import type { SagaGenerator } from "../typed-saga";
import { stringifyWithMask } from "../util/json-util";

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string };

type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => unknown;

/**
 * A helper for ActionHandler functions (Saga).
 */
export function createActionHandlerDecorator<
    RootState extends State = State,
    This extends Module<RootState, string> = Module<RootState, string>,
    Fn extends (this: This, ...args: any[]) => unknown = ActionHandler,
>(interceptor: HandlerInterceptor<RootState>) {
    return (fn: Fn, context: ClassMethodDecoratorContext<This, Fn>) => {
        return function (this: This, ...args: any[]) {
            const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
            // Do not use fn.actionName, it returns undefined
            // The reason is, fn is created before module register(), and the actionName had not been attached then
            boundFn.actionName = (this as any)[context.name].actionName;
            boundFn.maskedParams = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...args) || "[No Parameter]";
            return interceptor(boundFn, this as any);
        };
    };
}
