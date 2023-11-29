import { BASIC_AUTH_TOKEN, DEV_PROXY_HOST, isDevelopment, WEB_TOKEN } from "config/static-envs";
import { StorageService } from "utils/StorageService";

export enum ContentType {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
}

export type RequestMethod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH";

export const ignoreName = ["login"];
export const whitelistUrl = ["/api/auth/oauth/token"];

let host = "";
let TOKEN = "";

// 获取 ip
const getHost = () => {
    if (host) {
        return host;
    }

    if (isDevelopment) {
        host = StorageService.get(DEV_PROXY_HOST);
    }

    return host;
};

export function joinUrl(path) {
    if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
    }
    return (host || getHost() || "") + path;
}

// 获取 授权 头
export function getAuthorization() {
    if (TOKEN) {
        return `Bearer ${TOKEN}`;
    }
    TOKEN = StorageService.get(WEB_TOKEN) || "";
    return TOKEN ? `Bearer ${TOKEN}` : BASIC_AUTH_TOKEN;
}

// 退出时 清空 TOKEN 否者下次请求 TOKEN 还是以前的
export function clearToken() {
    TOKEN = "";
}

export function clearHost() {
    host = "";
}
