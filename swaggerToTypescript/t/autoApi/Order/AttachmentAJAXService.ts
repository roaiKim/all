import {Attachment} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AttachmentAJAXService {
    /**
     * @description 订单回单附件
     * @param in path {number} id
     * @returns Attachment[]
     */
    public static attachmentReceiptUsingGET(id: number): Promise<Attachment[]> {
        return ajax("GET", `/attachment/order/receipt/{id}`, {id}, {});
    }

    /**
     * @description 订单收货方附件
     * @param in path {number} id
     * @returns Attachment[]
     */
    public static attachmentReceiverUsingGET(id: number): Promise<Attachment[]> {
        return ajax("GET", `/attachment/order/receiver/{id}`, {id}, {});
    }

    /**
     * @description 订单发货方附件
     * @param in path {number} id
     * @returns Attachment[]
     */
    public static attachmentSenderUsingGET(id: number): Promise<Attachment[]> {
        return ajax("GET", `/attachment/order/sender/{id}`, {id}, {});
    }

    /**
     * @description 运单凭证附件
     * @param in path {number} id
     * @returns Attachment[]
     */
    public static attachmentVoucherUsingGET(id: number): Promise<Attachment[]> {
        return ajax("GET", `/attachment/stowage/voucher/{id}`, {id}, {});
    }
}
