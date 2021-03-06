import { ajax } from "@core";
import { OrderServicePaymentRequest, PageDataLimitResponse, PageRecordsLimitResponse } from "type";
import { ContentType } from "type/global";

export class OrderService {
    static getCarType(): Promise<PageRecordsLimitResponse> {
        return ajax("POST", `/api/common/carType/getCarTypes`, {}, { pageNo: 1, pageSize: 100 });
    }

    static order(request): Promise<PageDataLimitResponse> {
        return ajax("POST", `/api/tms/h5cashOrder/add`, {}, request);
    }

    static getOrders(request): Promise<PageDataLimitResponse> {
        return ajax("POST", `/api/tms/cashOrder/advanced-page`, {}, request);
    }

    static payment(request: OrderServicePaymentRequest): Promise<any> {
        return ajax("POST", `/api/tms/cashOrder/order`, {}, request, { contentType: ContentType.FORM_CONTENT_TYPE } as any);
    }

    static sendInvoice(id: string, invoiceTitleId: string): Promise<any> {
        return ajax("GET", `/api/tms/h5cashOrder/invoice/:id`, { id }, { invoiceTitleId });
    }

    static getLog(transportOrderId: string): Promise<any> {
        return ajax("GET", `/api/tms/h5cashOrder/log/:transportOrderId`, { transportOrderId }, { transportOrderId });
    }
}
