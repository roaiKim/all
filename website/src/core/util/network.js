import axios, { CancelToken } from "axios";
import { message } from "antd";
import { completePath } from "./config";

const httpRequestMap = new Map();
if (process.env.NODE_ENV === "development") {
    window.httpRequestMap = httpRequestMap;
}

axios.interceptors.response.use((response) => {

    // 删除 map url
    if (response && response.config && response.config.url) {
        if (httpRequestMap.has(response.config.url)) {
            httpRequestMap.delete(response.config.url);
        }
    }
    return new Promise((resolve, reject) => {

        // console.log("responses bail", response);
        // code 不为 0 ，则请求时成功的 但是 没有正确处理 如 新建用户时 但是用户已存在
        if (response.data.code !== 0) {
            if (response.config.bail) {
                reject(response.data);
            } else {
                if (response.data && response.data.message) {
                    message.error(response.data.message);
                }
                reject(new Error(response.data.message));
            }
        }
        resolve(response.data.data);
    });
}, (error) => {

    // 删除 map url
    // console.log("error.responses", error.response);
    if (error.response && error.response.config && error.response.config.url) {
        if (httpRequestMap.has(error.response.config.url)) {
            httpRequestMap.delete(error.response.config.url);
        }
    }
    return new Promise((resolve, reject) => {

        // 这个是由于 取消重复的请求造成的错误
        if (axios.isCancel(error)) {

            // console.log('Request canceled', error.message);
            reject(new Error(error.message));
        }
        if (error.response) {

            // 这里是 http 错误
            // console.log("error.response", error.response);
            // config 含有 bail 属性 则错误自己处理
            if (error.response.config && error.response.config.bail) {
                const resp = {
                    data: error.response.data,
                    status: error.response.status,
                };
                reject(resp);
            } else {
                let errorMessage = "";
                switch (error.response.status) {
                case 401:
                    errorMessage = "未登录";
                    break;
                case 403:
                    errorMessage = "没有权限";
                    break;
                case 502:
                    errorMessage = "网络错误";
                    break;
                case 504:
                    errorMessage = "网络超时";
                    break;
                default:
                    errorMessage = "服务器错误";
                    break;
                }
                message.error(errorMessage);
            }
            reject(new Error("服务器返回错误"));
        } else {

            // TODO 这里是网络错误
            reject(new Error("网络错误"));
        }
    });
});

/**
 *
 * @param {string} method - 请求方法 必须全部大写
 * @param {string} path - 路径 支持正则路径 "/api/user/check/:id"
 * @param {object} pathParams - 正则路径相匹配的对象
 * @param {object} request - 请求参数 POST 和 GET 形式一样
 * @param {AxiosRequestConfig} axiosExtraConfig  - axios的其他参数 外加 bail 参数 bail 控制发生错误时是否自动处理 false 为自动处理
 * @param {Boolean} cancelPrev - 对于相同的请求 是否取消上一次的请求 默认不取消
 * @returns {Promise}
 *
 * @example
 * GET方法， 路径为 /api/user/check，参数为 request，如果错误 则自己处理，如果遇到相同的请求 则取消上一次的
 * ajax("GET", "/api/user/check", {}, request, {bail: true}, true)
 *
 * 路径为 /api/user/check/980
 * ajax("GET", "/api/user/check/:userId", {userId: 980}, request, {bail: true}, true)
 *
 */
export function ajax(method, path, pathParams, request, axiosExtraConfig = {}, cancelPrev = false) {
    const fullUrl = completePath(getURL(path, pathParams));

    // bail 用来 判断 当发生错误时 是否自动处理(如弹窗等)
    const config = { ...axiosExtraConfig, method, url: fullUrl };

    if (method === "GET" || method === "DELETE") {
        config.params = request;
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
        config.data = request;
    }

    // 如果取消上一次的
    if (cancelPrev) {

        // 判断 是否有相同的未取消的 请求
        if (httpRequestMap.has(fullUrl)) {
            httpRequestMap.get(fullUrl).cancel && httpRequestMap.get(fullUrl).cancel("Request canceled because of Repeated");
        }

        // 取消 重复请求
        const source = CancelToken.source();
        config.cancelToken = source.token;
        httpRequestMap.set(fullUrl, {
            cancel: source.cancel,
        });
    }
    return axios.request(config);
}

// 这个是处理含有正则路由的 // "/api/user/check/:id", {id: 980} -> "/api/user/check/980"
export function getURL(pattern, params) {
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
