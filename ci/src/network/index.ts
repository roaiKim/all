import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { APIException, NetworkConnectionException, setHistory } from "@core";
import { ContentType, DEV_PROXY_HOST, isDevelopment } from "utils/function/staticEnvs";
import { StorageService } from "utils/StorageService";
import { getToken, whitelistUrl } from "./config";
import { stringify } from "querystring";
import { push } from "connected-react-router";

export type PathParams<T extends string> = string extends T
    ? { [key: string]: string | number }
    : T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof PathParams<Rest>]: string | number }
    : T extends `${infer Start}:${infer Param}`
    ? { [k in Param]: string | number }
    : {};

export interface APIErrorResponse {
    code: number;
    data: string;
    msg: string;
    success: boolean;
}

axios.defaults.transformResponse = (data, headers) => {
    const contentType = headers?.["content-type"];
    if (contentType?.startsWith("application/json")) {
        return JSON.parse(data);
    }
    return data;
};

axios.interceptors.response.use(
    (response: any) => {
        return new Promise((resolve, reject) => {
            const serviceData = response.data || {};
            if (serviceData.success && serviceData?.code === 200) {
                return resolve(serviceData.data);
            }
            const url = response.config?.url || "";
            const white = whitelistUrl.some((item) => url.includes(item));
            if (white) {
                return resolve(serviceData);
            }

            const errorMessage = `请求失败: code=${serviceData?.code || ""} ${serviceData?.msg || ""}`;
            reject(serviceData);

            throw new APIException(errorMessage, serviceData?.code, response.config?.url, serviceData, "0", serviceData?.code);
        });
    },
    (e) => {
        if (axios.isAxiosError(e)) {
            const error = e as AxiosError<APIErrorResponse | undefined>;
            const requestURL = error.config.url || "-";
            if (error.response) {
                const responseData = error.response.data;
                const errorCode = responseData?.code || null;
                if (error.response.status === 502 || error.response.status === 504) {
                    throw new NetworkConnectionException(`网络错误: (${error.response.status})`, requestURL, error.message);
                } else if (error.response.status === 401) {
                    const isLoginPage = location.href.includes("login"); // 是登录页
                    const isLoginAction = requestURL.includes("auth/oauth/token");
                    const errorMessage: string = isLoginPage && isLoginAction ? "账号或密码错误" : "未登录或登录过期, 请重新登录";
                    if (!isLoginPage) {
                        setHistory("/login");
                    }
                    throw new APIException(errorMessage, error.response.status, requestURL, responseData, "0", errorCode);
                } else {
                    const errorMessage: string = responseData?.msg || `[No Response]`;
                    throw new APIException(errorMessage, error.response.status, requestURL, responseData, "0", errorCode);
                }
            } else {
                throw new NetworkConnectionException(`连接失败: ${requestURL}`, requestURL, error.message);
            }
        } else {
            throw new NetworkConnectionException(`未知的网络错误:`, `[No URL]`, e.toString());
        }
    }
);

interface RequestConfig extends AxiosRequestConfig {
    contentType?: ContentType;
    headers?: Record<string, any>;
    errorPermit?: boolean; // 错误是否全局处理,当发生错误时,会尝试全局处理错误, 如果你的错误需要自己处理, 传 false
}

export async function ajax<Response, Path extends string>(
    method: Method,
    path: Path,
    pathParams?: PathParams<Path>,
    request?: any,
    extraConfig?: RequestConfig
): Promise<Response> {
    const fullURL = urlParams(path, pathParams);
    const { contentType, errorPermit, headers = {}, ...restAxios } = extraConfig || {};

    const requestConfig: any = {
        restAxios,
        errorPermit,
        method,
        url: fullURL,
    };
    console.log("--fullURL--", fullURL);
    if (method === "GET" || method === "DELETE") {
        requestConfig.params = request;
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
        requestConfig.data = request; //contentType && contentType === ContentType.FORM ? stringify(request) : request;
    }

    requestConfig.headers = {
        "Content-Type": contentType || ContentType.JSON,
        "Auth-Sub": "user",
        Authorization: getToken()(),
        ...headers,
    };

    return axios.request(requestConfig);
}

export function uri<Request>(path: string, request: Request): string {
    const config: AxiosRequestConfig = { method: "GET", url: path, params: request };
    return axios.getUri(config);
}

export function urlParams(pattern: string, params?: object): string {
    if (!params) {
        // if (isDevelopment) {
        //     return StorageService.get(DEV_PROXY_HOST, "") + pattern;
        // }
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    // if (isDevelopment) {
    //     return StorageService.get(DEV_PROXY_HOST, "") + url;
    // }
    return url;
}
