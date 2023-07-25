import { ErrorListener } from "@core";
import Taro from "@tarojs/taro";
import { APIException, Exception, NetworkConnectionException } from "core/exception";
import { isProduntion } from "utils/static-envs";

const createErrorMessage = (title) => {
    Taro.showToast({ title, icon: "none", duration: 3000 });
};

export default class ErrorHandler implements ErrorListener {
    onError(error: Exception) {
        console.log("---------------------------------------------------------------------", error);
        if (error instanceof APIException) {
            if (error.statusCode === 401 || error.statusCode === 403) {
                // createErrorMessage({ title: "发生错误", content: error.message });
                createErrorMessage(error.message);
            } else if (error.statusCode === 404) {
                // setHistory("/");
            } else if (error.statusCode === 400) {
                // createErrorMessage({ title: "发生错误", content: error.message });
                createErrorMessage(error.message);
            } else {
                createErrorMessage(isProduntion ? "发生网络错误，请稍后重试" : error.message);
            }
        } else if (error instanceof NetworkConnectionException) {
            createErrorMessage("网络连接超时，请稍后重试");
        } else {
            // const errorMessage = isProduntion ? "发生错误，请稍后重试" : error.message;
            // createErrorMessage(errorMessage);
        }
    }
}
