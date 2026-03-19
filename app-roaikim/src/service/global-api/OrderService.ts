// import { ajax } from "@core";
// import { OrderServicePaymentRequest, PageDataLimitResponse, PageRecordsLimitResponse } from "type/api.type";

// export class OrderService {
//     static getCarType(): Promise<PageRecordsLimitResponse> {
//         return ajax("POST", `/api/common/carType/getCarTypes`, null, { pageNo: 1, pageSize: 100 });
//     }

//     static order(request): Promise<PageDataLimitResponse> {
//         return ajax("POST", `/api/tms/h5cashOrder/add`, null, request);
//     }

//     static getOrders(request): Promise<PageDataLimitResponse> {
//         return ajax("POST", `/api/tms/cashOrder/advanced-page`, null, request);
//     }

//     static payment(request: OrderServicePaymentRequest): Promise<any> {
//         return ajax("POST", `/api/tms/cashOrder/order`, null, request);
//     }

//     static sendInvoice(id: string, invoiceTitleId: string): Promise<any> {
//         return ajax("GET", `/api/tms/h5cashOrder/invoice/${id}`, null, { invoiceTitleId });
//     }

//     static getLog(transportOrderId: string): Promise<any> {
//         return ajax("GET", `/api/tms/h5cashOrder/log/${transportOrderId}`, null, { transportOrderId });
//     }
// }
