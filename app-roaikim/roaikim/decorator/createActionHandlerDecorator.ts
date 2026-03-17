import { app } from "../app";
import type { ActionHandler } from "../module";
import type { Module, PromiseGenerator } from "../platform/Module";
import type { State } from "../reducer";
// import type { SagaGenerator } from "../typed-saga";
import { stringifyWithMask } from "../util/json-util";

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string };

type HandlerInterceptor = (handler: ActionHandlerWithMetaData, thisModule: Module<any, any>) => unknown;

/**
 * A helper for ActionHandler functions (Saga).
 */
export function createActionHandlerDecorator<RootState extends State = State>(interceptor: HandlerInterceptor) {
    return function <
        RootStateInner extends State = RootState,
        ThisInner extends Module<RootStateInner, string> = Module<RootStateInner, string>,
        FnInner extends (this: ThisInner, ...args: any[]) => unknown = ActionHandler,
    >(fn: FnInner, context: ClassMethodDecoratorContext<ThisInner, FnInner>) {
        return function (this: ThisInner, ...args: Parameters<FnInner>): ReturnType<FnInner> {
            const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
            // Do not use fn.actionName, it returns undefined
            // The reason is, fn is created before module register(), and the actionName had not been attached then
            boundFn.actionName = (this as any)[context.name].actionName;
            boundFn.maskedParams = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...args) || "[No Parameter]";
            return interceptor(boundFn, this as any) as ReturnType<FnInner>;
        };
    };
}
