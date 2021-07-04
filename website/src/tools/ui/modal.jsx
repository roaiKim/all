import { Modal } from "antd";

export function createPromisedConfirmation(text) {
    return new Promise((resolve) => {
        Modal.confirm({
            title: "提示",
            content: text,
            centered: true,
            cancelText: "取消",
            okText: "确定",
            className: "ro-confirm-wrap",
            onCancel: () => resolve("cancel"),
            onOk: () => resolve("ok"),
        });
    });
}
