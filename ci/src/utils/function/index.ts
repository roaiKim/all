import ProxyConfig from "@proxy-config";
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
} from "config/static-envs";
import { StorageService } from "utils/StorageService";
import { encrypted } from "./crypto";

/**
 * 转换菜单 dev
 * @param menus
 * @returns
 */
export function transformMeuns(menus) {
    const list = [];
    menus.forEach((item) => {
        let children = undefined;
        const childrenLength = item.children?.length;
        if (childrenLength && item.children.every((item1) => item1.type === "page" || item1.type === "category")) {
            children = item.children;
        }
        list.push({
            key: item.key,
            label: item.label,
            children: children ? transformMeuns(children) : undefined,
        });
    });
    return list;
}

/**
 * 初始化 表格数据
 * @returns
 */
export function initialTableSource() {
    return {
        table: {
            source: {
                data: [],
                pageIndex: 1,
                pageSize: 20,
                total: "0",
            },
            sourceLoading: true,
            sourceLoadError: false,
        },
    };
}

/**
 * 防抖函数
 * @param handle
 * @param delay
 * @param immdiate
 * @returns
 */
export function debounce(handler: (...args: any[]) => any, delay: number, immdiate = false) {
    let timer = null;
    let isInvoke = false;

    function _debounce(...arg: any[]) {
        if (timer) clearTimeout(timer);
        if (immdiate && !isInvoke) {
            handler.apply(this, arg);
            isInvoke = true;
        } else {
            timer = setTimeout(() => {
                handler.apply(this, arg);
                isInvoke = false;
                timer = null;
            }, delay);
        }
    }

    _debounce.cancel = function () {
        if (timer) clearTimeout(timer);
        timer = null;
        isInvoke = false;
    };
    return _debounce;
}

/**
 *
 * @returns {value, label}[]
 */
export function ProxyConfigDataSource() {
    return Object.entries(ProxyConfig).map(([value, label]) => ({ value, label }));
}

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

    StorageService.set(encrypted(LOGIN_REMEMBER_USERNAME), encrypted(username));
    StorageService.set(encrypted(LOGIN_REMEMBER_PASSWORD), encrypted(password));
}

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
