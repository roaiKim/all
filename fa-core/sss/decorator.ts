/* eslint-disable func-names */
import { app } from "./app";
import { ActionHandler, LifecycleDecoratorFlag } from "./module";
import { loadingAction } from "./reducer";
import { State } from "./type";
import { ModuleLifecycleListener } from "./platform/Module";

type HandlerDecorator = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<ActionHandler>) => TypedPropertyDescriptor<ActionHandler>;
type LifecycleHandlerDecorator = (target: object, propertyKey: keyof ModuleLifecycleListener, descriptor: TypedPropertyDescriptor<ActionHandler & LifecycleDecoratorFlag>) => TypedPropertyDescriptor<ActionHandler>;
type HandlerInterceptor<S> = (handler: ActionHandler, rootState: Readonly<S>) => any;

export function createActionHandlerDecorator<S extends State = State>(interceptor: HandlerInterceptor<S>): HandlerDecorator {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value!;
        // eslint-disable-next-line no-param-reassign
        descriptor.value = function (...args: any[]) {
            const rootState: S = app.store.getState() as S;
            return interceptor(fn.bind(this, ...args), rootState);
        };
        return descriptor;
    };
}

export function Loading(identifier = "global"): HandlerDecorator {
    return createActionHandlerDecorator(async (handler) => {
        try {
            app.store.dispatch(loadingAction(true, identifier));
            await handler();
        } finally {
            app.store.dispatch(loadingAction(false, identifier));
        }
    });
}

export function Lifecycle(): LifecycleHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        // eslint-disable-next-line no-param-reassign
        descriptor.value!.isLifecycle = true;
        return descriptor;
    };
}
