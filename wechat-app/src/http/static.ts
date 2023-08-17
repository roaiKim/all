import Taro from "@tarojs/taro";
import { WEB_TOKEN } from "config/static-envs";
import { baseApi } from "./config";

export const BASIC_AUTH_TOKEN = "Basic Y2xpZW50OjBhNmNkNjhmYWJhOTQzMjhhNzQzMjg2YjFjZjE0ZTkz";

export enum ContentType {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
}

export type RequestMethod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";

// 这个白名单是 用于当接口返回没有 code === 200 时启用
export const urlwhitelist = ["auth/oauth/token"];

let host = "";
let TOKEN = "";

export const getUrl = (path: string) => {
    const url = joinUrl(path);
    return url;
};

// 获取完整的地址
export function joinUrl(path) {
    if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
    }
    return (host || getHost() || "") + path;
}

// 获取 ip
const getHost = () => {
    if (host) {
        return host;
    }
    // 获取当前帐号信息
    const accountInfo = Taro.getAccountInfoSync();
    // env类型
    const env = accountInfo.miniProgram.envVersion;
    host = baseApi[env];

    return host;
};

// 获取 授权 头
export function getAuthorization() {
    if (TOKEN) {
        return `Bearer ${TOKEN}`;
    }
    TOKEN = Taro.getStorageSync(WEB_TOKEN) || "";
    return TOKEN ? `Bearer ${TOKEN}` : BASIC_AUTH_TOKEN;
}

// 退出时 清空 TOKEN 否者下次请求 TOKEN 还是以前的
export function clearToken() {
    TOKEN = "";
}
