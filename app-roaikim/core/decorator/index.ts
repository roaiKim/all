import type { ActionHandler } from "../module";
import { Module } from "../platform/Module";
import type { State } from "../reducer";

type HandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ActionHandler>
) => TypedPropertyDescriptor<ActionHandler>;

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string };

type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => unknown;

// export function createActionHandlerDecorator<RootState extends State = State>(interceptor: HandlerInterceptor<RootState>): HandlerDecorator {
//     return (target, propertyKey, descriptor) => {
//         const fn = descriptor.value!;
//         descriptor.value = function (...args: any[]) {
//             const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
//             boundFn.actionName = (descriptor.value as any).actionName;
//             return interceptor(boundFn, this as any);
//         };
//         return descriptor;
//     };
// }
// export function createActionHandlerDecorator<
//     RootState extends State = State,
//     This extends Module<RootState, string> = Module<RootState, string>,
//     Target extends (this: This, ...args: any[]) => any = ActionHandlerWithMetaData,
// >(interceptor: HandlerInterceptor<RootState>) {
//     return (target: Target, context: ClassMethodDecoratorContext<This, Target>) => {
//         // const fn = descriptor.value!;
//         // descriptor.value = function (...args: any[]) {
//         //     const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
//         //     boundFn.actionName = (descriptor.value as any).actionName;
//         //     return interceptor(boundFn, this as any);
//         // };
//         // return descriptor;
//         return function (this: This, ...args: any[]) {
//             const boundFn: ActionHandlerWithMetaData = target.bind(this, ...args) as any;
//             boundFn.actionName = (this as any)[context.name].actionName;
//             // boundFn.actionName = (content.value as any).actionName;
//             return interceptor(boundFn, this as any);
//         };
//     };
// }
export function createActionHandlerDecorator(interceptor) {
    return (target, context) => {
        // const fn = descriptor.value!;
        // descriptor.value = function (...args: any[]) {
        //     const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
        //     boundFn.actionName = (descriptor.value as any).actionName;
        //     return interceptor(boundFn, this as any);
        // };
        // return descriptor;
        return function (this, ...args: any[]) {
            const boundFn: ActionHandlerWithMetaData = target.bind(this, ...args) as any;
            boundFn.actionName = (this as any)[context.name].actionName;
            // boundFn.actionName = (content.value as any).actionName;
            return interceptor(boundFn, this as any);
        };
    };
}
