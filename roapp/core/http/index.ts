import Taro from "@tarojs/taro";
import { baseApi } from "./config";

const httpRequestMap = new Map();
// wechat 居然没用
// if (process.env.NODE_ENV === "development") {
//     window.httpRequestMap = httpRequestMap;
// }

const contentTypeMap = {
    JSON: "application/json",
    FORM_DATA: "multipart/form-data",
    FORM: "application/x-www-form-urlencoded",
};

// 这个是 请求接口的
export function ajax(method, path, pathParams, request, contentType, axiosExtraConfig, cancelPrev = false) {
    const url = getURL(path, pathParams);
    const fullUrl = completePath(url);
    const { headers = {}, ...restConfig } = axiosExtraConfig || {};
    const config = {
        url: fullUrl,
        method,
        header: {
            ...headers,
            "content-type": contentTypeMap[contentType || "JSON"],
            Authorization: getAuthorization(),
        },
        ...restConfig,
        data: request,
        complete: () => {
            if (httpRequestMap.has(url)) {
                httpRequestMap.delete(url);
            }
        },
    };

    const requestTask = Taro.request(config);

    // 如果取消上一次的
    if (cancelPrev) {
        // 判断 是否有相同的未取消的 请求
        if (httpRequestMap.has(url)) {
            httpRequestMap.get(url).cancel && httpRequestMap.get(url).cancel("Request canceled because of Repeated");
        }
        // 取消 重复请求
        httpRequestMap.set(url, {
            cancel: () => requestTask.abort(),
        });
    }
    return requestTask.then((response) => response.data);
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

let authorization = "";

// 获取 授权 头
export function getAuthorization() {
    if (authorization) {
        return `Bearer ${authorization}`;
    }

    authorization = Taro.getStorageSync("_token") || "";

    return `Bearer ${authorization}`;
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
