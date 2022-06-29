import { ActionHandler, TickIntervalDecoratorFlag } from "../module";

type OnTickHandlerDecorator = (
    target: object,
    propertyKey: "onTick",
    descriptor: TypedPropertyDescriptor<ActionHandler & TickIntervalDecoratorFlag>
) => TypedPropertyDescriptor<ActionHandler>;

export function Interval(second: number): OnTickHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.tickInterval = second;
        return descriptor;
    };
}
