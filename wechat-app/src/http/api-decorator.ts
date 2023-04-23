import { ActionHandler } from "core/module";
import { RequestMethod } from "./network";

interface MethodDecoratorFlag {
    httpMethod?: RequestMethod;
}

type OnTickHandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ActionHandler & MethodDecoratorFlag>
) => TypedPropertyDescriptor<ActionHandler>;

export function Method(method: RequestMethod): OnTickHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.httpMethod = method;
        return descriptor;
    };
}
