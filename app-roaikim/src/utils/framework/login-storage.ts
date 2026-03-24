import {
    LOGIN_REMEMBER_PASSWORD,
    LOGIN_REMEMBER_USERNAME,
    WEB_COMMA_TENANT_ID,
    WEB_DEPARTMENT_ID,
    WEB_FULL_NAME,
    WEB_GET_TOKEN_TIME,
    WEB_IS_LOGIN,
    WEB_NEW_USER,
    WEB_REFRESH_TOKEN,
    WEB_TOKEN,
    WEB_USER_ID,
    WEB_USER_INFO,
    WEB_USERNAME,
} from "config/static-constant";
import { StorageService } from "utils/StorageService";
import { encrypted } from "../function/crypto";

/**
 * 设置需要 缓存的登录信息
 * @param response
 * @param username
 * @param password
 */
export function setLocalStorageWhenLogined(response, username, password) {
    const { access_token, refresh_token = "", user_id, dept_id, new_user, full_name, extra = {} } = response;
    StorageService.set(WEB_IS_LOGIN, true);
    StorageService.set(WEB_TOKEN, access_token);
    StorageService.set(WEB_USER_ID, `${user_id}`);
    StorageService.set(WEB_DEPARTMENT_ID, `${dept_id}`);
    StorageService.set(WEB_REFRESH_TOKEN, refresh_token);
    StorageService.set(WEB_USERNAME, username);
    StorageService.set(WEB_FULL_NAME, full_name);
    StorageService.set(WEB_NEW_USER, new_user);
    StorageService.set(WEB_COMMA_TENANT_ID, extra["Comma-Tenant-Id"]);
    StorageService.set(WEB_GET_TOKEN_TIME, new Date().getTime());
    StorageService.set(WEB_USER_INFO, response);

    StorageService.set(encrypted(LOGIN_REMEMBER_USERNAME), encrypted(username));
    StorageService.set(encrypted(LOGIN_REMEMBER_PASSWORD), encrypted(password));
}

/**
 * 清除需要 缓存的登录信息
 */
export function clearLocalStorageWhenLogout() {
    StorageService.remove(WEB_IS_LOGIN);
    StorageService.remove(WEB_TOKEN);
    StorageService.remove(WEB_USER_ID);
    StorageService.remove(WEB_DEPARTMENT_ID);
    StorageService.remove(WEB_REFRESH_TOKEN);
    StorageService.remove(WEB_USERNAME);
    StorageService.remove(WEB_FULL_NAME);
    StorageService.remove(WEB_COMMA_TENANT_ID);
    StorageService.remove(WEB_NEW_USER);
    StorageService.remove(WEB_GET_TOKEN_TIME);
    StorageService.remove(WEB_USER_INFO);
}
