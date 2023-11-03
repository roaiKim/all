import Taro from "@tarojs/taro";
import { APIException, NetworkConnectionException } from "@core";
import { ContentType, RequestMethod, getAuthorization, joinUrl, urlwhitelist } from "./static";

interface AjaxConfig {
    headers: Record<string, any>;
    config: Record<string, any>;
    globalHold: boolean;
}

// Taro.addInterceptor(interceptor);

export function ajax<Request, Response, Path extends string>(
    method: RequestMethod,
    path: Path,
    request: Request = undefined,
    contentType: keyof typeof ContentType = "JSON",
    ajaxConfig: Partial<AjaxConfig> = {}
): Promise<Response> {
    const url = joinUrl(path);

    const { headers = {}, config = {}, globalHold = true } = ajaxConfig || {};

    const requestTask = Taro.request({
        url: url,
        method,
        header: {
            Authorization: getAuthorization(),
            "Auth-Sub": "MINI_APP",
            "content-type": ContentType[contentType],
            ...headers,
        },
        data: request,
        ...config,
    });

    return requestTask.then((response) => {
        const { data: responseData = {}, statusCode } = response;
        const errorMessage: string = responseData?.msg || `[No Response]`;

        // 设置全局不拦截 则交给请求函数自行 catch
        if (!globalHold) {
            return responseData;
        }

        // http 状态码 非200报错
        if (statusCode !== 200) {
            // 服务器/网络错误
            if (statusCode >= 500 && statusCode <= 504) {
                throw new NetworkConnectionException(errorMessage, statusCode, path);
            }
            throw new APIException(errorMessage, statusCode, path, responseData);
        }

        // 接口返回的 code非200为业务报错
        if (responseData.code !== 200) {
            const isInWhitelist = urlwhitelist.filter((item) => url.includes(item))?.length;
            if (isInWhitelist) {
                return responseData;
            }
            // 服务器/网络错误
            if (statusCode >= 500 && statusCode <= 504) {
                throw new NetworkConnectionException(errorMessage, statusCode, path);
            }
            throw new APIException(errorMessage, responseData.code, path, responseData);
        }
        return responseData.data;
    });
}
