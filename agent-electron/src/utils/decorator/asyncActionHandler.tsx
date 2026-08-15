import { Modal } from "antd";

type CreatePromisedConfirmationPromise = "ok" | "cancel";

export function createPromisedConfirmation(text: string): Promise<CreatePromisedConfirmationPromise> {
    return new Promise((resolve) => {
        Modal.confirm({
            title: "操作提示",
            content: text,
            onOk: () => {
                resolve("ok");
            },
            okText: "确认",
            cancelText: "取消",
            onCancel: () => {
                resolve("cancel");
            },
        });
    });
}
