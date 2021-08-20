import {Attachment} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AttachmentAJAXService {
    /**
     * @description 订单回单附件
     * @returns Attachment[]
     */
    public static attachmentReceiptUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/attachment/order/receipt/{id}", {}, {});
    }

    /**
     * @description 订单收货方附件
     * @returns Attachment[]
     */
    public static attachmentReceiverUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/attachment/order/receiver/{id}", {}, {});
    }

    /**
     * @description 订单发货方附件
     * @returns Attachment[]
     */
    public static attachmentSenderUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/attachment/order/sender/{id}", {}, {});
    }

    /**
     * @description 运单凭证附件
     * @returns Attachment[]
     */
    public static attachmentVoucherUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/attachment/stowage/voucher/{id}", {}, {});
    }
}
