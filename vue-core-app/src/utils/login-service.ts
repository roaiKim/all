import type { AuthTokenResponse } from "@/service/api/LoginService"
import {
  LOGIN_REMEMBER_PASSWORD,
  LOGIN_REMEMBER_USERNAME,
  WEB_DEPARTMENT_ID,
  WEB_GETTOKENTIME,
  WEB_ISLOGIN,
  WEB_NEW_USER,
  WEB_REFRESHTOKEN,
  WEB_TOKEN,
  WEB_USER_INFO,
  WEB_USERID,
  WEB_USERNAME,
} from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import { encrypted } from "./crypto"

/**
 * 设置需要 缓存的登录信息
 * @param response
 * @param username
 * @param password
 */
export function setLocalStorageWhenLogined(response: AuthTokenResponse, username: string, password: string) {
  const { access_token, refresh_token = "", user_id, dept_id, new_user } = response
  StorageService.set(WEB_ISLOGIN, true)
  StorageService.set(WEB_TOKEN, access_token)
  StorageService.set(WEB_USERID, `${user_id}`)
  StorageService.set(WEB_DEPARTMENT_ID, `${dept_id}`)
  StorageService.set(WEB_REFRESHTOKEN, refresh_token)
  StorageService.set(WEB_USERNAME, username)
  StorageService.set(WEB_NEW_USER, new_user)
  StorageService.set(WEB_GETTOKENTIME, new Date().getTime())
  StorageService.set(WEB_USER_INFO, response)

  StorageService.set(encrypted(LOGIN_REMEMBER_USERNAME), encrypted(username))
  StorageService.set(encrypted(LOGIN_REMEMBER_PASSWORD), encrypted(password))
}

/**
 * 清除需要 缓存的登录信息
 */
export function clearLocalStorageWhenLogout() {
  StorageService.remove(WEB_ISLOGIN)
  StorageService.remove(WEB_TOKEN)
  StorageService.remove(WEB_USERID)
  StorageService.remove(WEB_DEPARTMENT_ID)
  StorageService.remove(WEB_REFRESHTOKEN)
  StorageService.remove(WEB_USERNAME)
  StorageService.remove(WEB_NEW_USER)
  StorageService.remove(WEB_GETTOKENTIME)
  StorageService.remove(WEB_USER_INFO)
}
