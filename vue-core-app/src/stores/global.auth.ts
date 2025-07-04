import { reactive } from "vue"
import { defineStore } from "pinia"

export const useAuthGolbalStore = defineStore("__AUTH_GLOBAL__", () => {
  const initialAuthState = {}

  const permissions = reactive<{ auth: Record<string, any> }>({ auth: initialAuthState })

  function $reset() {
    permissions.auth = initialAuthState
  }

  function setAuth(permission) {
    permissions.auth = permission
  }

  return { permissions, $reset, setAuth }
})
