import { createActionHandlerDecorator } from "./createActionHandler"

/**
 * @description loading
 * @param identifier loading的标识 用于区分不同的loading, 取值时 showLoading 的第二个参数
 * @returns
 */
export function loading(identifier = "global") {
  return createActionHandlerDecorator(async (handler, that) => {
    // try {
    //     app.store.dispatch(loadingAction(true, identifier));
    //     await handler();
    // } finally {
    //     app.store.dispatch(loadingAction(false, identifier));
    // }
  })
}
