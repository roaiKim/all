import Taro from "@tarojs/taro";

type CreatePromisedConfirmationPromise = "ok" | "cancel";

export function createPromisedConfirmation(text: string): Promise<CreatePromisedConfirmationPromise> {
    return new Promise((resolve) => {
        Taro.showModal({
            title: "提示",
            content: text,
            success: function (res) {
                if (res.confirm) {
                    resolve("ok");
                } else if (res.cancel) {
                    resolve("cancel");
                }
            },
        });
    });
}
