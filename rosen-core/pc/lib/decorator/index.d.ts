import { ActionHandler } from "../module";
import { Module } from "../platform/Module";
import { State } from "../reducer";
type HandlerDecorator = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<ActionHandler>) => TypedPropertyDescriptor<ActionHandler>;
type ActionHandlerWithMetaData = ActionHandler & {
    actionName: string;
    maskedParams: string;
};
type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => unknown;
export declare function createActionHandlerDecorator<RootState extends State = State>(interceptor: HandlerInterceptor<RootState>): HandlerDecorator;
export {};
