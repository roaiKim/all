import { ActionHandler, onDestroyIntervalDecoratorFlag } from "../module";

type OnDestroyHandlerDecorator = (
    target: object,
    propertyKey: "onDestroy",
    descriptor: TypedPropertyDescriptor<ActionHandler & onDestroyIntervalDecoratorFlag>
) => TypedPropertyDescriptor<ActionHandler>;

export function KeepState(keep: boolean): OnDestroyHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.keep = keep;
        return descriptor;
    };
}
