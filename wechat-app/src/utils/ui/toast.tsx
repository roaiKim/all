import Taro from "@tarojs/taro";

export const Toast = function () {};

Toast.success = (title = "操作成功", duration = 2000) => {
    Taro.showToast({
        title: title,
        icon: "none",
        duration,
    });
};
