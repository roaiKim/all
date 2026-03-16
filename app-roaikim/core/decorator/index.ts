import type { ActionHandler } from "../module";
import { Module } from "../platform/Module";
import type { State } from "../reducer";

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string };

type HandlerInterceptor<RootState extends State = State> = (
    handler?: ActionHandlerWithMetaData,
    thisModule?: Module<RootState, string>
) => Promise<void>;

export function createActionHandlerDecorator<
    RootState extends State = State,
    This extends Module<RootState, string> = Module<RootState, string>,
    Fn extends (this: This, ...args: any[]) => unknown = ActionHandler,
>(interceptor: HandlerInterceptor<RootState>) {
    return (target: Fn, context: ClassMethodDecoratorContext<This, Fn>) => {
        return function (this: This, ...args: any[]) {
            const boundFn: ActionHandlerWithMetaData = target.bind(this, ...args) as any;
            boundFn.actionName = this[context.name].actionName;
            return interceptor(boundFn, this as any);
        };
    };
}
