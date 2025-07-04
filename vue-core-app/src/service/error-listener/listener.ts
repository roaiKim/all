import { APIException, NetworkConnectionException, type Exception } from "@/http/type"
import { message } from "ant-design-vue"
import type { ErrorListener } from "."
import { LoginService } from "../api/LoginService"
import { clearLocalStorageWhenLogout } from "@/utils/login-service"
import { clearToken } from "@/http"
import router from "@/router"
import { DEV_PROXY_HOST, isDevelopment } from "../config/static-envs"
import { StorageService } from "../StorageService"

export default class ErrorListenerHandler implements ErrorListener {
  onError(error: Exception) {
    if (error instanceof APIException) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        message.error(`未登录或登录已过期, 请重新登录。错误码: ${error.statusCode}`)
        this.logout()
      } else if (error.statusCode === 404) {
        message.error(`资源不存在, 请确认。 ${error.requestURL}, 错误码: ${error.statusCode}`)
        //
      } else if (error.statusCode === 400) {
        message.error(`${error.message}, 错误码: ${error.statusCode}`)
      } else {
        message.error(`${error.message}, 错误码: ${error.statusCode}`)
      }
    } else if (error instanceof NetworkConnectionException) {
      message.error(`${error.message}, ${error.originalErrorMessage}`)
      if (isDevelopment) {
        const proxyHost = StorageService.get(DEV_PROXY_HOST)
        if (!proxyHost) {
          message.error("请选择代理环境")
          clearToken()
          router.push("/login")
        }
      }
    } else {
      // const errorMessage = isProduntion ? "发生错误，请稍后重试" : error.message;
      // createErrorMessage(errorMessage);
    }
  }

  async logout() {
    await LoginService.logout()
    clearLocalStorageWhenLogout()
    clearToken()
    router.push("/login")
  }
}
