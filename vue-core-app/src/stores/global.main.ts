import { ref, computed, reactive } from "vue"
import { defineStore } from "pinia"
import type { AuthTokenResponse } from "@/service/api/LoginService"
import { clearLocalStorageWhenLogout } from "@/utils/login-service"

interface NavPermission {
  key: string
  label: string
  children?: NavPermission[]
}

// export interface MainGolbalState {
//   /**
//    * 权限数据加载是否完成
//    */
//   PERMISSION_DONE: boolean | null
//   /**
//    * 菜单权限 只作用于菜单
//    */
//   navPermission: NavPermission[] | null
//   /**
//    * 页面权限
//    */
//   pagePermission: Record<string, { name: string }> | null
// }

// export const useMainGolbalStore = defineStore("main", () => {
//   const mainStore = reactive<MainGolbalState>({ PERMISSION_DONE: null, navPermission: null, pagePermission: null })

//   function $reset() {
//     mainStore.PERMISSION_DONE = null
//     mainStore.navPermission = null
//     mainStore.pagePermission = null
//   }

//   function setPermission(config) {
//     mainStore.PERMISSION_DONE = config
//   }

//   function setState(PERMISSION_DONE, navPermission, pagePermission) {
//     mainStore.PERMISSION_DONE = PERMISSION_DONE
//     mainStore.navPermission = navPermission
//     mainStore.pagePermission = pagePermission
//   }

//   return { mainStore, $reset, setPermission, setState }
// })
