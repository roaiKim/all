import axios from 'axios';
axios.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        // 这里是其他错误
        throw new Error('服务器返回错误');
    }
    else {
        // TODO 这里是网络错误
        throw new Error('网络错误');
    }
});
export function ajax(method, url, request) {
    const config = { method, url };
    if (method === 'GET' || method === 'DELETE') {
        config.params = request;
    }
    else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        config.data = request;
    }
    return axios.request(config).then((response) => response.data);
}
