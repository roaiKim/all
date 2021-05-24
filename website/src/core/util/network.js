import axios from 'axios';
import {message} from 'antd';

axios.interceptors.response.use((response) => {
    if (response.data.code !== 0) {
        if (response.config.bail) {
            return response.data
        } else {
            message.error(response.data && response.data.error)
            throw new Error(response.data.error);
        }
    }
    return response.data.data
}, (error) => {
    if (error.response) {
        // 这里是其他错误
        // console.log("error.response", error.response);
        if (error.response.config && error.response.config.bail) {
            const resp = {
                data: error.response.data,
                status: error.response.status
            }
            return resp;
        } else {
            let errorMessage = "";
            switch(error.response.status) {
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
            message.error(errorMessage)
        }
        throw new Error('服务器返回错误');
    } else {
        // TODO 这里是网络错误
        throw new Error('网络错误');
    }
});
export function ajax(method, url, request, tail = {}) {
    const config = { method, url, bail: tail.bail};
    if (method === 'GET' || method === 'DELETE') {
        config.params = request;
    }
    else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        config.data = request;
    }
    return axios.request(config);
}
