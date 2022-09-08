import { APIException, ErrorListener, Exception, NetworkConnectionException, setHistory } from "@core";
import { message } from "antd";
import { isProduntion } from "utils/function/staticEnvs";

const createErrorMessage = message.error;

export default class ErrorHandler implements ErrorListener {
    onError(error: Exception) {
        console.log("-errorListener-error-", error);
        if (error instanceof APIException) {
            if (error.statusCode === 401 || error.statusCode === 403) {
                createErrorMessage({ title: "发生错误", content: error.message });
            } else if (error.statusCode === 404) {
                setHistory("/");
            } else if (error.statusCode === 400) {
                createErrorMessage({ title: "发生错误", content: error.message });
            } else {
                createErrorMessage(isProduntion ? "发生网络错误，请稍后重试" : error.message);
            }
        } else if (error instanceof NetworkConnectionException) {
            createErrorMessage("网络连接超时，请稍后重试");
        } else {
            const errorMessage = isProduntion ? "发生错误，请稍后重试" : error.message;
            createErrorMessage(errorMessage);
        }
    }
}
