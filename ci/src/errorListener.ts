import { APIException, ErrorListener, Exception, Module, NetworkConnectionException, setHistory } from "@core";
import { message, Modal } from "antd";
import { isProduntion } from "utils/function/staticEnvs";
// import { createErrorMessage } from "util/ui/message";
// import { createSyncModal } from "util/ui/modal";
import { StorageService } from "utils/StorageService";

const createErrorMessage = message.error;
const createSyncModal = Modal.error;

export default class ErrorHandler implements ErrorListener {
    onError(error: Exception) {
        if (error instanceof APIException) {
            if (error.statusCode === 401 || error.statusCode === 403) {
                const isLoginPage = location.href.includes("login"); // 是登录页
                // StorageService.clear();
                if (!isLoginPage) {
                    setHistory("/login");
                }
                createErrorMessage({ title: "发生错误", content: error.message });
            } else if (error.statusCode === 404) {
                setHistory("/");
            } else if (error.statusCode === 400) {
                createSyncModal({ title: "发生错误", content: error.message });
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