import { ref, computed, reactive } from "vue"
import { defineStore } from "pinia"
import type { AuthTokenResponse } from "@/service/api/LoginService"
import { clearLocalStorageWhenLogout } from "@/utils/login-service"

export const useUserGolbalStore = defineStore("useInfo", () => {
  const initialUserState = {
    access_token: "",
    dept_id: "",
    expires_in: null,
    license: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    user_id: "",
    username: "",
    new_user: false,
  }

  const userInfo = reactive<{ user: AuthTokenResponse }>({ user: initialUserState })

  function $reset() {
    userInfo.user = initialUserState
    // 清除缓存
    clearLocalStorageWhenLogout()
  }

  return { userInfo, $reset }
})
