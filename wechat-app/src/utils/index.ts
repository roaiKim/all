import Taro from "@tarojs/taro";

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
