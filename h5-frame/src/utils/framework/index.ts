import ProxyConfig from "config/development.proxy.json";
import {
    WEB_DEPARTMENT_ID,
    WEB_GETTOKENTIME,
    WEB_ISLOGIN,
    WEB_NEW_USER,
    WEB_REFRESHTOKEN,
    WEB_TOKEN,
    WEB_USER_INFO,
    WEB_USERID,
    WEB_USERNAME,
} from "config/static-envs";
import { StorageService } from "utils/StorageService";

/**
 *
 * @returns {value, label}[]
 */
export function ProxyConfigDataSource() {
    return Object.entries(ProxyConfig).map(([value, label]) => ({ value, label: `${value}(${label})` }));
}

/**
 * 设置需要 缓存的登录信息
 * @param response
 * @param username
 * @param password
 */
export function setLocalStorageWhenLogined(response, username, password) {
    const { access_token, refresh_token = "", user_id, dept_id, new_user } = response;
    StorageService.set(WEB_ISLOGIN, true);
    StorageService.set(WEB_TOKEN, access_token);
    StorageService.set(WEB_USERID, `${user_id}`);
    StorageService.set(WEB_DEPARTMENT_ID, `${dept_id}`);
    StorageService.set(WEB_REFRESHTOKEN, refresh_token);
    StorageService.set(WEB_USERNAME, username);
    StorageService.set(WEB_NEW_USER, new_user);
    StorageService.set(WEB_GETTOKENTIME, new Date().getTime());
    StorageService.set(WEB_USER_INFO, response);
}

/**
 * 清除需要 缓存的登录信息
 */
export function clearLocalStorageWhenLogout() {
    StorageService.remove(WEB_ISLOGIN);
    StorageService.remove(WEB_TOKEN);
    StorageService.remove(WEB_USERID);
    StorageService.remove(WEB_DEPARTMENT_ID);
    StorageService.remove(WEB_REFRESHTOKEN);
    StorageService.remove(WEB_USERNAME);
    StorageService.remove(WEB_NEW_USER);
    StorageService.remove(WEB_GETTOKENTIME);
    StorageService.remove(WEB_USER_INFO);
}
