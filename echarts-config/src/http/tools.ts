import { BASIC_AUTH_TOKEN, DEV_PROXY_HOST, isDevelopment, WEB_COMMA_TENANT_ID, WEB_TOKEN } from "@service/config/static-envs";
import { StorageService } from "@service/StorageService";

let host: any = "";
let TOKEN = "";
let COMMA_TENANT_ID = "";

// 获取 ip
const getHost = () => {
    if (host) {
        return host;
    }

    if (isDevelopment) {
        // host = "karry-sass-uat" //StorageService.get(DEV_PROXY_HOST)
        host = "karry-sit"; //StorageService.get(DEV_PROXY_HOST)
    }

    return host;
};

export function joinUrl(path: string) {
    if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
    }
    return (host || getHost() || "") + path;
    // return `http://192.168.2.46:31029/${host || getHost() || ""}${path}`
}

// 获取 授权 头
export function getAuthorization() {
    if (TOKEN) {
        return `Bearer ${TOKEN}`;
    }
    TOKEN = StorageService.get(WEB_TOKEN) || "";
    return TOKEN ? `Bearer ${TOKEN}` : BASIC_AUTH_TOKEN;
}
export function getCommaTenantId() {
    if (COMMA_TENANT_ID) {
        return COMMA_TENANT_ID;
    }
    COMMA_TENANT_ID = StorageService.get(WEB_COMMA_TENANT_ID) || "";
    return COMMA_TENANT_ID || null;
}

// 退出时 清空 TOKEN 否者下次请求 TOKEN 还是以前的
export function clearToken() {
    TOKEN = "";
}

export function clearHost() {
    host = "";
}

export function setHost() {
    host = StorageService.get(DEV_PROXY_HOST);
}
