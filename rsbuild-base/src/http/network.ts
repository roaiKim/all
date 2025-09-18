import axios, { AxiosError } from "axios";
import { getAuthorization, getCommaTenantId, joinUrl } from "./tools";
import { APIException, ContentType, NetworkConnectionException, type RequestMethod, whitelistUrl } from "./type";

export interface APIErrorResponse {
    code: number;
    data: string;
    msg: string;
    success: boolean;
}

export const axiosInstance = axios.create({
    timeout: 60000,
    headers: {
        "Content-Type": ContentType.JSON,
        "Auth-Sub": "user",
        // Authorization: getAuthorization(), // 这里需要实时取值
    },
});

const networkErrorStatusCodes: number[] = [0, 502, 504];

interface AjaxConfig {
    headers: Record<string, any>;
    config: Record<string, any>;
    globalHold: boolean;
}

export async function ajax<Request, Response, Path extends string>(
    method: RequestMethod,
    path: Path,
    request: Request | undefined = undefined,
    contentType: keyof typeof ContentType = "JSON",
    ajaxConfig: Partial<AjaxConfig> = {}
): Promise<Response> {
    const fullURL = joinUrl(path);
    const { headers = {}, config = {}, globalHold = true } = ajaxConfig || {};

    const requestConfig: any = {
        method,
        url: fullURL,
        headers: {
            "Content-Type": ContentType[contentType],
            Authorization: getAuthorization(),
            "Comma-Tenant-Id": getCommaTenantId(),
            ...headers,
        },
        globalHold,
        ...config,
    };

    if (method === "GET" || method === "DELETE") {
        requestConfig.params = request;
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
        requestConfig.data = request; //contentType && contentType === ContentType.FORM ? stringify(request) : request;
    }

    return axiosInstance.request(requestConfig);
}

axiosInstance.interceptors.response.use(
    (response: any) => {
        // console.log("-interceptors-response-success-", response);
        return new Promise((resolve, reject) => {
            const globalHold = (response.config as any).globalHold; // 自定义 config globalHold
            if (!globalHold) {
                return response;
            }
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
    (error) => {
        if (axios.isAxiosError(error)) {
            // console.log("-interceptors-response-error-", error.response);
            const typedError = error as AxiosError<APIErrorResponse | undefined> & {
                globalHold: boolean;
            };
            const requestURL = typedError?.config?.url || "-";
            const globalHold = (typedError.config as any).globalHold; // 自定义 config globalHold

            // 服务器返回了信息 response
            if (typedError.response) {
                const responseHeaders = typedError.response.headers;
                // 如果后台返回的是 json 格式
                if (responseHeaders["content-type"]?.includes("application/json")) {
                    // 设置全局不拦截 则交给请求函数自行 catch
                    if (!globalHold) {
                        return typedError.response;
                    }
                    const responseData = typedError.response.data;
                    const responseStatus = typedError.response.status;

                    if (responseData && !networkErrorStatusCodes.includes(responseStatus)) {
                        const errorMessage: string = responseData.msg || `[No Response]`;
                        const errorCode = responseData?.code || null;
                        throw new APIException(errorMessage, typedError.response.status, requestURL, responseData, null, errorCode);
                    }
                } else {
                    console.log("-interceptors-error.response.headers=", typedError.response.headers);
                }
            }

            throw new NetworkConnectionException(
                `Failed to connect: ${requestURL}`,
                requestURL,
                `${typedError.code || "UNKNOWN"}: ${typedError.message}`
            );
            // throw new NetworkConnectionException(`请求失败: ${requestURL}`, requestURL, typedError.message);
        } else {
            throw new NetworkConnectionException(`Unknown network error`, `[No URL]`, error.toString());
        }
    }
);

/**
 * @description: 没有基地址 访问根目录下文件
 * @param {string} url
 * @param {Params} params
 * @return {*}
 */
export const GETNOBASE = async (url: string, params?: any): Promise<any> => {
    try {
        const data = await axios.get(url, {
            params,
        });
        return data.data;
    } catch (error) {
        return Promise.reject(error);
    }
};
