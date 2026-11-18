import { APIException, ErrorListener, Exception, NetworkConnectionException, roDispatch } from "@core";
import { loginPage } from "@config/static-envs";
import { actions } from "@pages/main";
import Taro from "@tarojs/taro";
import { roBackHistory, roPushHistory } from "@utils";

const createErrorMessage = (title) => {
    Taro.showToast({ title, icon: "none", duration: 3000 });
};

export default class ErrorHandler implements ErrorListener {
    onError(error: Exception) {
        console.log("---------ErrorListener-----", error);
        if (error instanceof APIException) {
            if (error.statusCode === 401 || error.statusCode === 403) {
                Taro.showModal({
                    title: "错误",
                    content: `未登录或登录已过期, 请重新登录。错误码: ${error?.statusCode || ""}`,
                    showCancel: false,
                    confirmText: "登录",
                    success: (response) => {
                        if (response.confirm) {
                            roPushHistory(loginPage, null, { redirection: true });
                            roDispatch(actions.clearLoginState());
                        } else if (response.cancel) {
                            roDispatch(actions.clearLoginState());
                            roPushHistory("/pages/home/index");
                        }
                    },
                });
            } else if (error.statusCode === 404) {
                Taro.showModal({
                    title: "错误",
                    content: `资源不存在, 请确认。 ${error.requestURL}, 错误码: ${error?.statusCode || ""}`,
                    showCancel: false,
                    success: (response) => {
                        if (response.confirm) {
                            roBackHistory();
                        }
                    },
                });
            } else if (error.statusCode === 400) {
                Taro.showModal({
                    title: "错误",
                    content: `${error.message}, 错误码: ${error?.statusCode || ""}`,
                    showCancel: false,
                    success: (response) => {
                        if (error.message?.includes("授权登录")) {
                            if (response.confirm) {
                                roPushHistory(loginPage, null, { redirection: true });
                                roDispatch(actions.clearLoginState());
                            } else if (response.cancel) {
                                roDispatch(actions.clearLoginState());
                                roPushHistory("/pages/home/index");
                            }
                        }
                    },
                });
            } else {
                Taro.showModal({
                    title: "错误",
                    content: `${error.message}, 错误码: ${error?.statusCode || ""}`,
                    showCancel: false,
                });
            }
        } else if (error instanceof NetworkConnectionException) {
            Taro.showModal({
                title: "错误",
                content: `${error.message}, 错误码: ${error?.statusCode || ""}`,
                showCancel: false,
            });
        } else {
            // const errorMessage = isProduntion ? "发生错误，请稍后重试" : error.message;
            // createErrorMessage(errorMessage);
        }
    }
}
