import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { APIException, NetworkConnectionException } from "@core";
import { ContentType, DEV_PROXY_HOST, isDevelopment } from "utils/function/staticEnvs";
import { StorageService } from "utils/StorageService";
import { getToken } from "./config";
import { stringify } from "querystring";

export type PathParams<T extends string> = string extends T
    ? { [key: string]: string | number }
    : T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof PathParams<Rest>]: string | number }
    : T extends `${infer Start}:${infer Param}`
    ? { [k in Param]: string | number }
    : {};

export interface APIErrorResponse {
    id?: string | null;
    errorCode?: string | null;
    message?: string | null;
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
        const serviceData = response.data || {};
        if (serviceData && serviceData.code === 0) {
            return serviceData.data;
        }
        return serviceData;
    },
    (e) => {
        if (axios.isAxiosError(e)) {
            const error = e as AxiosError<APIErrorResponse | undefined>;
            const requestURL = error.config.url || "-";
            if (error.response) {
                const responseData = error.response.data;
                const errorId: string | null = responseData?.id || null;
                const errorCode: string | null = responseData?.errorCode || null;

                if (!errorId && (error.response.status === 502 || error.response.status === 504)) {
                    throw new NetworkConnectionException(`Gateway error (${error.response.status})`, requestURL, error.message);
                } else {
                    const errorMessage: string = responseData && responseData.message ? responseData.message : `[No Response]`;
                    throw new APIException(errorMessage, error.response.status, requestURL, responseData, errorId, errorCode);
                }
            } else {
                throw new NetworkConnectionException(`Failed to connect: ${requestURL}`, requestURL, error.message);
            }
        } else {
            throw new NetworkConnectionException(`Unknown network error`, `[No URL]`, e.toString());
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
        if (isDevelopment) {
            return StorageService.get(DEV_PROXY_HOST, "") + pattern;
        }
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    if (isDevelopment) {
        return StorageService.get(DEV_PROXY_HOST, "") + url;
    }
    return url;
}
