import { createActionHandlerDecorator } from "./createActionHandler"
import { Modal } from "ant-design-vue"

type CreatePromisedConfirmationPromise = "ok" | "cancel"

function createPromisedConfirmation(text: string): Promise<CreatePromisedConfirmationPromise> {
  return new Promise((resolve) => {
    Modal.confirm({
      title: "操作提示",
      content: text,
      onOk: () => {
        resolve("ok")
      },
      okText: "确认",
      cancelText: "取消",
      onCancel: () => {
        resolve("cancel")
      },
    })
  })
}

/**
 * @description 二次确认
 * @param text 显示文本
 * @returns null
 */
export function confirm(text: string) {
  return createActionHandlerDecorator(async (hander) => {
    const result = await createPromisedConfirmation(text)
    if (result === "ok") {
      hander()
    }
  })
}
