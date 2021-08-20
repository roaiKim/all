import {OrderRouterSegmentPageListVo, Stowage, Attachment, Page} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AppAJAXService {
    /**
     * @description 到达提货地
     * @returns boolean
     */
    public static arriveSendLocalUsingGET(): Promise<boolean> {
        return ajax("GET", "/app/arriveSendLocal/{id}/{stowageOrderSegmentId}", {}, {});
    }

    /**
     * @description 要求退回
     * @returns boolean
     */
    public static backLocalUsingGET(): Promise<boolean> {
        return ajax("GET", "/app/backLocal/{stowageOrderSegmentId}", {}, {});
    }

    /**
     * @description 离开目的地
     * @returns boolean
     */
    public static leaveReceiptLocalUsingGET(): Promise<boolean> {
        return ajax("GET", "/app/leaveSendLocal/{id}/{stowageOrderSegmentId}", {}, {});
    }

    /**
     * @description 派送扫码获取数据
     * @returns OrderRouterSegmentPageListVo
     */
    public static deliveryScanCodeUsingGET(): Promise<OrderRouterSegmentPageListVo> {
        return ajax("GET", "/app/order/deliveryScanCode", {}, {});
    }

    /**
     * @description 派送签收
     * @returns boolean
     */
    public static deliverySignUsingPOST(): Promise<boolean> {
        return ajax("POST", "/app/order/deliverySign", {}, {});
    }

    /**
     * @description 扫码取货
     * @returns boolean
     */
    public static scanCodePickUpUsingPOST(): Promise<boolean> {
        return ajax("POST", "/app/order/scanCodePickUp", {}, {});
    }

    /**
     * @description 签收扫码获取数据
     * @returns OrderRouterSegmentPageListVo
     */
    public static signScanCodeUsingGET(): Promise<OrderRouterSegmentPageListVo> {
        return ajax("GET", "/app/order/signScanCode", {}, {});
    }

    /**
     * @description 扫描二维码进入运单详情
     * @returns Stowage
     */
    public static scanStowageNumberUsingGET(): Promise<Stowage> {
        return ajax("GET", "/app/scanStowageNumber", {}, {});
    }

    /**
     * @description 删除凭证
     * @returns string
     */
    public static deleteVoucherUsingGET(): Promise<string> {
        return ajax("GET", "/app/sendCar/deleteVoucher/{attachmentId}", {}, {});
    }

    /**
     * @description 获取凭证列表
     * @returns Attachment[]
     */
    public static getAttachmentListUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/app/sendCar/getAttachmentList/{stowageOrderId}", {}, {});
    }

    /**
     * @description 上传凭证
     * @returns string
     */
    public static uploadVoucherUsingPOST(): Promise<string> {
        return ajax("POST", "/app/sendCar/uploadVoucher", {}, {});
    }

    /**
     * @description 配载单列表
     * @returns Page<Stowage>
     */
    public static stowageListUsingPOST(): Promise<Page<Stowage>> {
        return ajax("POST", "/app/stowage/list", {}, {});
    }
}
