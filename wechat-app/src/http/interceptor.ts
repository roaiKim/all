import { APIException } from "core/exception";
import { urlwhitelist } from "./static";

export const interceptor = function (chain) {
    const requestParams = chain.requestParams;
    const { method, data, url } = requestParams;

    return chain.proceed(requestParams).then((response) => {
        const { data: responseData = {}, statusCode } = response;
        const errorMessage: string = responseData?.msg || `[No Response]`;
        console.log("---res--", response);

        // http 状态码 非200报错
        if (statusCode !== 200) {
            throw new APIException(errorMessage, statusCode, url, responseData);
        }

        // 接口返回的 code非200为业务报错
        if (responseData.code !== 200) {
            const isInWhitelist = urlwhitelist.filter((item) => url.includes(item))?.length;
            if (isInWhitelist) {
                return response;
            }
            throw new APIException(errorMessage, statusCode, url, responseData);
        }
        return response;
    });
};
