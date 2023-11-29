// import axios, { AxiosError } from "axios";
// import { whitelistUrl } from "./static-type";
// import { APIException, NetworkConnectionException } from "@core";
// import { APIErrorResponse, axiosInstance } from "./network";
// import { WEB_TOKEN } from "config/static-envs";
// import { StorageService } from "utils/StorageService";

// axiosInstance.interceptors.response.use(
//     (response: any) => {
//         console.log("-interceptors-success", response);
//         return new Promise((resolve, reject) => {
//             const serviceData = response.data || {};
//             if (serviceData.success && serviceData?.code === 200) {
//                 return resolve(serviceData.data);
//             }
//             const url = response.config?.url || "";
//             const white = whitelistUrl.some((item) => url.includes(item));
//             if (white) {
//                 return resolve(serviceData);
//             }

//             const errorMessage = `请求失败: code=${serviceData?.code || ""} ${serviceData?.msg || ""}`;
//             reject(serviceData);

//             throw new APIException(errorMessage, serviceData?.code, response.config?.url, serviceData, "0", serviceData?.code);
//         });
//     },
//     (e) => {
//         console.log("-interceptors-error", JSON.stringify(e));
//         if (axios.isAxiosError(e)) {
//             const error = e as AxiosError<APIErrorResponse | undefined>;
//             const requestURL = error.config.url || "-";
//             console.log("-interceptors-error.config", error);
//             if (error.response) {
//                 const responseData = error.response.data;
//                 const errorCode = responseData?.code || null;
//                 if (error.response.status === 502 || error.response.status === 504) {
//                     throw new NetworkConnectionException(`网络错误: (${error.response.status})`, requestURL, error.message);
//                 } else if (error.response.status === 401) {
//                     StorageService.set(WEB_TOKEN, null);
//                     const isLoginPage = location.href.includes("login"); // 是登录页
//                     const isLoginAction = requestURL.includes("auth/oauth/token");
//                     const errorMessage: string = isLoginPage && isLoginAction ? "账号或密码错误" : "未登录或登录过期, 请重新登录";
//                     if (!isLoginPage) {
//                         // setHistory("/login");
//                     }
//                     throw new APIException(errorMessage, error.response.status, requestURL, responseData, "0", errorCode);
//                 } else {
//                     const errorMessage: string = responseData?.msg || `[No Response]`;
//                     throw new APIException(errorMessage, error.response.status, requestURL, responseData, "0", errorCode);
//                 }
//             } else {
//                 throw new NetworkConnectionException(`连接失败: ${requestURL}`, requestURL, error.message);
//             }
//         } else {
//             throw new NetworkConnectionException(`未知的网络错误:`, `[No URL]`, e.toString());
//         }
//     }
// );
