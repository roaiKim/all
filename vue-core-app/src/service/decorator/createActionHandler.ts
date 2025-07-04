type ActionHandler = (...args: any[]) => any

type HandlerDecorator = (
  target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<ActionHandler>,
) => TypedPropertyDescriptor<ActionHandler>

type ActionHandlerWithMetaData = ActionHandler & { actionName: string; maskedParams: string }

type HandlerInterceptor = (handler: ActionHandlerWithMetaData, thisModule: any) => unknown

export function createActionHandlerDecorator(interceptor: HandlerInterceptor): HandlerDecorator {
  return (target, propertyKey, descriptor) => {
    const fn = descriptor.value!
    descriptor.value = function (...args: any[]) {
      const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any
      boundFn.actionName = (descriptor.value as any).actionName
      return interceptor(boundFn, this as any)
    }
    return descriptor
  }
}
