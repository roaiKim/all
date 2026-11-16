import { ajax } from "@http";

export class OrderService {
    //获取临床订单列表
    static getOrder(request): Promise<any> {
        return ajax("POST", "/client/small-program-order/advanced-page", request, "JSON");
    }
}
