import router from "@/router"
import { LoginService } from "@/service/api/LoginService"
import { DEV_PROXY_HOST, isDevelopment } from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import { useUserGolbalStore } from "@/stores/global.user"
import { encrypted } from "@/utils/crypto"
import { setLocalStorageWhenLogined } from "@/utils/login-service"
import { message } from "ant-design-vue"
import { v4 } from "uuid"
import { actions as MainActions } from "../main"
import { Module, moduleRegister } from "@/utils/register"

class LoginModule extends Module<object, "main"> {
  async login(username: string, password: string) {
    const request = {
      grant_type: "password",
      username: username.trim(),
      password: `${encrypted(password)}`,
      randomStr: v4(),
      code: "0000",
      imgCode: "0000",
    }
    const response = await LoginService.login(request).catch((error: any) => {
      let content = error?.originalErrorMessage || error?.message || ""
      if (isDevelopment) {
        const proxyHost = StorageService.get(DEV_PROXY_HOST)
        if (!proxyHost) {
          content = "请选择代理环境"
        }
      }
      message.error(content)
      return Promise.reject("ignore")
    })

    const user = useUserGolbalStore()
    user.userInfo.user = response
    router.push("/")
    message.success("登录成功")
    setLocalStorageWhenLogined(response, username, password)
    MainActions.fetchPermission()
  }
}

export const actions = moduleRegister(new LoginModule("main"))
