import { ActionHandler } from "core/module";
import { ContentType, RequestMethod } from "./static";

interface MethodDecoratorFlag {
    httpMethod?: RequestMethod;
    contentType?: keyof typeof ContentType;
}

type OnTickHandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ActionHandler & MethodDecoratorFlag>
) => TypedPropertyDescriptor<ActionHandler>;

export function Method(method: RequestMethod, contentType: keyof typeof ContentType = "JSON"): OnTickHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.httpMethod = method;
        descriptor.value!.contentType = contentType;
        return descriptor;
    };
}
