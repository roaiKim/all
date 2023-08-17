import Taro from "@tarojs/taro";
import { APIException } from "@core";

/**
 * 自动显示/隐藏 loading
 * @param autoLoading
 * @param title
 */
export function autoShowLoading(autoLoading: boolean, title = "加载中") {
    if (autoLoading) {
        Taro.showLoading({ title });
    } else {
        Taro.hideLoading();
    }
}

/**
 * 复制到剪切板
 * @param data
 */
export function copyToClipboard(data = "") {
    Taro.setClipboardData({
        data: data,
        success: function () {
            Taro.getClipboardData({
                success: function () {
                    Taro.showToast({
                        title: "成功复制到剪贴板!",
                        icon: "none",
                        mask: true,
                        duration: 2000,
                    });
                },
            });
        },
    });
}

/**
 * 判断是否是API异常
 * @param error
 * @returns
 */
export function isAPIException(error): boolean {
    return error instanceof APIException;
}

export function delayToast(title: string, delay = 2) {
    Taro.showToast({ title });
    return new Promise((resolve) => {
        setTimeout(resolve, delay * 1000);
    });
}
