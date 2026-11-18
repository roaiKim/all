import { WEB_COMMA_TENANT_ID, WEB_TOKEN } from "@config/static-envs";
import Taro from "@tarojs/taro";
import { baseApi } from "./config";

export const BASIC_AUTH_TOKEN = "Basic Y29tbWE6Y29tbWE=";

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
let commaTanentId = "";

export const getUrl = (path: string) => {
    const url = joinUrl(path);
    return url;
};

// 获取完整的地址
export function joinUrl(path) {
    if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
    }
    return (host || getHost() || "") + "/api" + path;
}

// 获取 ip
function getHost() {
    if (host) {
        return host;
    }
    // 获取当前帐号信息（H5 端无该 API，做兜底，避免获取 host 时抛错）
    const accountInfo = Taro.getAccountInfoSync?.();
    // env类型
    const env = accountInfo?.miniProgram?.envVersion || "develop";
    host = baseApi[env] || baseApi.develop;

    return host;
}

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

// 获取 租户id
export function getCommonTanentId() {
    if (commaTanentId) {
        return commaTanentId;
    }
    commaTanentId = Taro.getStorageSync(WEB_COMMA_TENANT_ID) || "";
    return commaTanentId;
}

// 退出时 租户id
export function clearCommonTanentId() {
    commaTanentId = "";
}
