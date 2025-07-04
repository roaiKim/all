import { clearToken } from "@/http"
import router from "@/router"
import { GolbalService } from "@/service/api/GolbalService"
import { LoginService } from "@/service/api/LoginService"
import { DEV_PROXY_HOST, isDevelopment, WEB_ISLOGIN, WEB_TOKEN } from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import { confirm } from "@/service/decorator"
import { clearLocalStorageWhenLogout } from "@/utils/login-service"
import { getAuthority, getPagePermission, transformMeuns } from "@/utils/permission"
import { Module, moduleRegister } from "@/utils/register"
import { captureError } from "@/service/error-listener"
import { useAuthGolbalStore } from "@/stores/global.auth"

interface NavPermission {
  key: string
  label: string
  children?: NavPermission[]
}

export interface MainGolbalState {
  PERMISSION_DONE: boolean | null
  navPermission: NavPermission[] | null
  pagePermission: Record<string, { name: string }> | null
}

const initialMainState = { PERMISSION_DONE: null, navPermission: null, pagePermission: null }

class MainModule extends Module<MainGolbalState, "main"> {
  //   store = useMainGolbalStore()
  async main() {
    const isLogin = StorageService.get(WEB_ISLOGIN)
    const webToken = StorageService.get(WEB_TOKEN)
    if (isDevelopment) {
      const proxyHost = StorageService.get(DEV_PROXY_HOST)
      if (!proxyHost) {
        clearLocalStorageWhenLogout()
        router.push("/login")
        return
      }
    }
    if (webToken && isLogin) {
      this.fetchPermission()
    } else {
      this.logout()
    }
  }

  async fetchPermission(callBack?: () => void) {
    const mainStore = this.store()
    const permission = await GolbalService.getByUserId().catch(
      (error) => ((mainStore.state.PERMISSION_DONE = false), captureError(error), Promise.reject("")),
    )
    const navPermission = transformMeuns(permission).slice(0, 2)
    mainStore.$patch((state) => {
      state.state.PERMISSION_DONE = true
      state.state.navPermission = navPermission
      state.state.pagePermission = getPagePermission()
    })
    // 设置权限到全局
    // const auth = getAuthority()
    // const useAuth = useAuthGolbalStore()
    // useAuth.setAuth(auth)
    if (callBack) {
      callBack()
    }
  }

  @confirm("确定退出吗")
  async logoutWithConfirm() {
    this.logout()
  }

  async logout() {
    await LoginService.logout()
    clearLocalStorageWhenLogout()
    clearToken()
    router.push("/login")
  }
}

export const actions = moduleRegister(new MainModule("main", initialMainState))
