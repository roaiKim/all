import { roApp, roDispatch } from "@core";
import Taro from "@tarojs/taro";
import { roEvent } from "utils/events";
import auth from "type/auth-file";
import { actions } from "pages/main/index.module";

import miniConfig from "config/mini-config";
import { isDevelopment } from "config/static-envs";

const pagePaths = miniConfig.pages;
const tabbarPaths = miniConfig.tabBar.list.map((item) => item.pagePath);
export const HISTORY_NAVIGATE_TO = "@@HISTORY_NAVIGATE_TO";
export const HISTORY_REDIRECT_TO = "@@HISTORY_REDIRECT_TO";

/**
 *
 * @param delta 返回页面数
 * @param success 成功回调
 */
export function roBackHistory(success?: () => void, delta = 1) {
    Taro.navigateBack({
        delta,
        success: () => {
            if (success) {
                success();
            }
        },
    });
}

type HistoryPath = (typeof miniConfig)["pages"][number] | (typeof miniConfig)["tabBar"]["list"][number]["pagePath"];

type VerifyPath<R> = R extends `${infer Rest}` ? `/${Rest}` : never;

/**
 *
 * @param path 路径
 * @param pathParams 路径参数
 * @param config.success 跳转成功事件
 * @param config.redirection 是否使用重定向
 * @returns
 */
export function roPushHistory(
    path: VerifyPath<HistoryPath>,
    pathParams?: Record<string, string | number>,
    config?: {
        success?: () => void;
        redirection?: boolean;
    }
) {
    const hasAuth = validateAuth(path);
    if (!hasAuth) {
        Taro.showModal({
            title: "跳转错误",
            content: "请登录后查看",
            showCancel: true,
            confirmText: "登录",
            success: (response) => {
                if (response.confirm) {
                    roDispatch(actions.clearLoginState());
                    roPushHistory("/pages/login/index");
                }
            },
        });
        return;
    }
    // if (!path || !path.startsWith("/pages") || path.includes("?")) {
    //     if (isDevelopment) {
    //         Taro.showModal({
    //             title: "跳转错误",
    //             content: "路径不合法, 请以 /pages 开头, 且不允许带参数",
    //             showCancel: false,
    //         });
    //     }
    //     return;
    // }
    const pathInTabBar = tabbarPaths.find((item) => `/${item}` === path);
    const pathInPage = pagePaths.find((item) => `/${item}` === path);
    // if (!pathInPage && !pathInTabBar) {
    //     if (isDevelopment) {
    //         Taro.showModal({
    //             title: "跳转错误",
    //             content: `路径(${path})不合法, 不在预设路径中`,
    //             showCancel: false,
    //         });
    //     }
    //     return;
    // }
    if (pathInTabBar) {
        // switchTab 不允许带参数
        // 触发路由监听
        roEvent.trigger(HISTORY_NAVIGATE_TO, path, pathParams);
        Taro.switchTab({
            url: path,
            success: () => {
                if (config?.success) {
                    config.success();
                }
            },
        });
    } else if (pathInPage) {
        const url = pathParams ? joinPathByParams(path, pathParams) : path;
        const { success, redirection } = config || {};
        if (redirection) {
            // 触发路由监听
            roEvent.trigger(HISTORY_REDIRECT_TO, path, pathParams);
            Taro.redirectTo({
                url,
                success: () => {
                    if (success) {
                        success();
                    }
                },
            });
        } else {
            // 触发路由监听
            roEvent.trigger(HISTORY_NAVIGATE_TO, path, pathParams);
            Taro.navigateTo({
                url,
                success: () => {
                    if (success) {
                        success();
                    }
                },
            });
        }
    }
}

const joinPathByParams = (path, pathParams) => {
    const query = Object.keys(pathParams)
        ?.map((item) => `${item}=${pathParams[item]}`)
        .join("&");
    return `${path}?${query}`;
};

const validateAuth = (path) => {
    const store = roApp.store.getState() as any;
    const currentModule = auth.find((item) => item.path === path);
    if (currentModule) {
        if (!store.app.main.loggedin) {
            return false;
        }
    }
    return true;
};
