import Taro from "@tarojs/taro";
import { baseApi } from "./config";

enum CONTENT_TYPE {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
}

export type RequestMethod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
export const BASIC_AUTH_TOKEN = "Basic Y2xpZW50OjBhNmNkNjhmYWJhOTQzMjhhNzQzMjg2YjFjZjE0ZTkz";

export type PathParams<T extends string> = string extends T
    ? { [key: string]: string | number }
    : T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof PathParams<Rest>]: string | number }
    : T extends `${infer Start}:${infer Param}`
    ? { [k in Param]: string | number }
    : Record<string, unknown>;

// 这个是 请求接口的
export function ajax<Request, Response, Path extends string>(
    method: RequestMethod,
    path: Path,
    pathParams: PathParams<Path>,
    request: Request,
    contentType: keyof typeof CONTENT_TYPE = "JSON",
    extraConfig: Record<string, any> = {}
): Promise<Response> {
    console.log("this-", this);
    const url = getURL(path, pathParams);
    const fullUrl = completePath(url);
    const { headers = {}, ...restConfig } = extraConfig || {};
    const config = {
        url: fullUrl,
        method,
        header: {
            Authorization: getAuthorization()(),
            ...headers,
            "Auth-Sub": "MINI_APP",
            "content-type": CONTENT_TYPE[contentType],
        },
        ...restConfig,
        data: request,
        complete: () => {},
    };

    const requestTask = Taro.request(config);

    return requestTask.then((response) => {
        if (path === "/auth/oauth/token") {
            if (response.statusCode === 426) {
                Taro.clearStorageSync();
                setTimeout(() => {
                    Taro.showToast({ title: "登录密码错误", icon: "error", duration: 2000 });
                }, 0);
            } else if (response.statusCode === 401) {
                Taro.clearStorageSync();
                setTimeout(() => {
                    Taro.showToast({ title: "账号不存在", icon: "error", duration: 2000 });
                }, 0);
            } else {
                return response.data;
            }
        } else if (path.indexOf("/client/customer-user/getOpenId/") != -1 || path.indexOf("/auth/mobile/token/social") != -1) {
            if (response.statusCode === 401) {
                Taro.clearStorageSync();
                setTimeout(() => {
                    Taro.showToast({ title: "微信登录失败", icon: "error", duration: 2000 });
                }, 0);
            } else {
                return response.data;
            }
        } else if (response.statusCode === 401 || response?.data?.code === 401) {
            Taro.clearStorageSync();
            setTimeout(() => {
                Taro.showToast({ title: "请先登录", icon: "error", duration: 2000 });
            }, 0);
            Taro.redirectTo({ url: "/pages/login/index" });
        } else {
            return response.data;
        }
    });
}

// 获取完整的地址
export function completePath(path) {
    if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
        return path;
    }
    return (getHost() || "") + path;
}

let host = "";

// 获取 ip
export const getHost = () => {
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
    let TOKEN = "";
    return () => {
        if (TOKEN) {
            return `Bearer ${TOKEN}`;
        }
        TOKEN = Taro.getStorageSync("_token") || "";
        return TOKEN ? `Bearer ${TOKEN}` : BASIC_AUTH_TOKEN;
    };
}

// 这个是处理含有正则路由的 // "/api/user/check/:id", {id: 980} -> "/api/user/check/980"
export function getURL(pattern: string, params?: object): string {
    if (!params) {
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(`:${name}`, encodedValue);
    });
    return url;
}
