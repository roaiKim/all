import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AttachmentAJAXService {
    // 订单回单附件;
    public static attachmentReceiptUsingGET(): Promise<any> {
        return ajax("GET", "/attachment/order/receipt/{id}", {}, {});
    }

    // 订单收货方附件;
    public static attachmentReceiverUsingGET(): Promise<any> {
        return ajax("GET", "/attachment/order/receiver/{id}", {}, {});
    }

    // 订单发货方附件;
    public static attachmentSenderUsingGET(): Promise<any> {
        return ajax("GET", "/attachment/order/sender/{id}", {}, {});
    }

    // 运单凭证附件;
    public static attachmentVoucherUsingGET(): Promise<any> {
        return ajax("GET", "/attachment/stowage/voucher/{id}", {}, {});
    }
}
