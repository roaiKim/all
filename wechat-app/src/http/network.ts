import Taro from "@tarojs/taro";
import { APIException } from "@core";
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
    request: Request,
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
        console.log("---res--", response);

        // 设置全局不拦截 则交给请求函数自行 catch
        if (!globalHold) {
            return responseData;
        }

        // http 状态码 非200报错
        if (statusCode !== 200) {
            throw new APIException(errorMessage, statusCode, url, responseData);
        }

        // 接口返回的 code非200为业务报错
        if (responseData.code !== 200) {
            const isInWhitelist = urlwhitelist.filter((item) => url.includes(item))?.length;
            if (isInWhitelist) {
                return responseData;
            }
            throw new APIException(errorMessage, statusCode, url, responseData);
        }
        return responseData;
    });
    // return requestTask.then((response) => {
    //     if (path === "/auth/oauth/token") {
    //         if (response.statusCode === 426) {
    //             Taro.clearStorageSync();
    //             setTimeout(() => {
    //                 Taro.showToast({ title: "登录密码错误", icon: "error", duration: 2000 });
    //             }, 0);
    //         } else if (response.statusCode === 401) {
    //             Taro.clearStorageSync();
    //             setTimeout(() => {
    //                 Taro.showToast({ title: "账号不存在", icon: "error", duration: 2000 });
    //             }, 0);
    //         } else {
    //             return response.data;
    //         }
    //     } else if (path.indexOf("/client/customer-user/getOpenId/") != -1 || path.indexOf("/auth/mobile/token/social") != -1) {
    //         if (response.statusCode === 401) {
    //             Taro.clearStorageSync();
    //             setTimeout(() => {
    //                 Taro.showToast({ title: "微信登录失败", icon: "error", duration: 2000 });
    //             }, 0);
    //         } else {
    //             return response.data;
    //         }
    //     } else if (response.statusCode === 401 || response?.data?.code === 401) {
    //         Taro.clearStorageSync();
    //         setTimeout(() => {
    //             Taro.showToast({ title: "请先登录", icon: "error", duration: 2000 });
    //         }, 0);
    //         Taro.redirectTo({ url: "/pages/login/index" });
    //     } else {
    //         return response.data;
    //     }
    // });
}
