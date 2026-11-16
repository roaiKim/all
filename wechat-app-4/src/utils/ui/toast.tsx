import Taro from "@tarojs/taro";

export const Toast = {
    text(title = "操作成功", duration = 2000) {
        Taro.showToast({
            title,
            icon: "none",
            duration,
        });
    },
    error(title = "操作失败", duration = 2000) {
        Taro.showToast({
            title,
            icon: "error",
            duration,
        });
    },
};
