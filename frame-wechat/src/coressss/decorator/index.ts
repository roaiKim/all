import { ActionHandler } from "../module";
import { Module } from "../platform/Module";
import { State } from "../reducer";

export { Interval } from "./Interval";
export { KeepState } from "./Keep";
export { Loading } from "./Loading";
export { Mutex } from "./Mutex";

type HandlerDecorator = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<ActionHandler>) => TypedPropertyDescriptor<ActionHandler>;

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string };

type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => unknown;

export function createActionHandlerDecorator<RootState extends State = State>(interceptor: HandlerInterceptor<RootState>): HandlerDecorator {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
            boundFn.actionName = (descriptor.value as any).actionName;
            return interceptor(boundFn, this as any);
        };
        return descriptor;
    };
}
