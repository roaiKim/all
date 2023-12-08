import { OrderServicePaymentRequest, PageDataLimitResponse, PageRecordsLimitResponse } from "type/api.type";
import { ajax } from "@http";

export class OrderService {
    static getCarType(): Promise<PageRecordsLimitResponse> {
        return ajax("POST", `/api/common/carType/getCarTypes`, { pageNo: 1, pageSize: 100 });
    }

    static order(request): Promise<PageDataLimitResponse> {
        return ajax("POST", `/api/tms/h5cashOrder/add`, request);
    }

    static getOrders(request): Promise<PageDataLimitResponse> {
        return ajax("POST", `/api/tms/cashOrder/advanced-page`, request);
    }

    static payment(request: OrderServicePaymentRequest): Promise<any> {
        return ajax("POST", `/api/tms/cashOrder/order`, request, "FORM");
    }

    static sendInvoice(id: string, invoiceTitleId: string): Promise<any> {
        return ajax("GET", `/api/tms/h5cashOrder/invoice/${id}`, { invoiceTitleId });
    }

    static getLog(transportOrderId: string): Promise<any> {
        return ajax("GET", `/api/tms/h5cashOrder/log/${transportOrderId}`, { transportOrderId });
    }
}
