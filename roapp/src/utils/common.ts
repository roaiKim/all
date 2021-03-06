import Taro from "@tarojs/taro";

export function autoShowLoading(autoLoading: boolean, title = "加载中") {
    if (autoLoading) {
        Taro.showLoading({ title });
    } else {
        Taro.hideLoading();
    }
}
