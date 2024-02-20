import { APIException, ErrorListener, Exception, NetworkConnectionException, roDispatchAction, roPushHistory } from "@core";
// import { message } from "antd";
import { actions as MainActions } from "module/common/main";

export default class ErrorHandler implements ErrorListener {
    onError(error: Exception) {
        // if (error instanceof APIException) {
        //     if (error.statusCode === 401 || error.statusCode === 403) {
        //         message.error(`未登录或登录已过期, 请重新登录。错误码: ${error.statusCode}`);
        //         roDispatchAction(MainActions.logout());
        //         roPushHistory("/login", { request: true });
        //     } else if (error.statusCode === 404) {
        //         message.error(`资源不存在, 请确认。 ${error.requestURL}, 错误码: ${error.statusCode}`);
        //         //
        //     } else if (error.statusCode === 400) {
        //         message.error(`${error.message}, 错误码: ${error.statusCode}`);
        //     } else {
        //         message.error(`${error.message}, 错误码: ${error.statusCode}`);
        //     }
        // } else if (error instanceof NetworkConnectionException) {
        //     message.error(`${error.message}, ${error.originalErrorMessage}`);
        // } else {
        //     // const errorMessage = isProduntion ? "发生错误，请稍后重试" : error.message;
        //     // createErrorMessage(errorMessage);
        // }
    }
}
