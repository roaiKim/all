import { ajax } from "core";

export class MainService {
    static getOrder(request) {
        return ajax("POST", "https://baiyun.smartcomma.com/api/order/app/order/list", request);
    }
}