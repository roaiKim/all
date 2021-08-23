import {OrderRouterSegmentPageListVo, DeliverySignDTO, ScanCodeDTO, Stowage, Attachment, AppUploadVoucherDTO, Page, PublicPagination} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AppAJAXService {
    /**
     * @description 到达提货地
     * @param in path {number} id
     * @param in path {number} stowageOrderSegmentId
     * @returns boolean
     */
    public static arriveSendLocalUsingGET(id: number, stowageOrderSegmentId: number): Promise<boolean> {
        return ajax("GET", `/app/arriveSendLocal/{id}/{stowageOrderSegmentId}`, {id, stowageOrderSegmentId}, {});
    }

    /**
     * @description 要求退回
     * @param in path {number} stowageOrderSegmentId
     * @returns boolean
     */
    public static backLocalUsingGET(stowageOrderSegmentId: number): Promise<boolean> {
        return ajax("GET", `/app/backLocal/{stowageOrderSegmentId}`, {stowageOrderSegmentId}, {});
    }

    /**
     * @description 离开目的地
     * @param in path {number} id
     * @param in path {number} stowageOrderSegmentId
     * @returns boolean
     */
    public static leaveReceiptLocalUsingGET(id: number, stowageOrderSegmentId: number): Promise<boolean> {
        return ajax("GET", `/app/leaveSendLocal/{id}/{stowageOrderSegmentId}`, {id, stowageOrderSegmentId}, {});
    }

    /**
     * @description 派送扫码获取数据
     * @param in query {string} code
     * @returns OrderRouterSegmentPageListVo
     */
    public static deliveryScanCodeUsingGET(code: string): Promise<OrderRouterSegmentPageListVo> {
        return ajax("GET", `/app/order/deliveryScanCode?code=${code}`, {}, {});
    }

    /**
     * @description 派送签收
     * @param in body {DeliverySignDTO} deliverySignDTO
     * @returns boolean
     */
    public static deliverySignUsingPOST(deliverySignDTO: DeliverySignDTO): Promise<boolean> {
        return ajax("POST", `/app/order/deliverySign`, {}, {deliverySignDTO});
    }

    /**
     * @description 扫码取货
     * @param in body {ScanCodeDTO} codeDTO
     * @returns boolean
     */
    public static scanCodePickUpUsingPOST(codeDTO: ScanCodeDTO): Promise<boolean> {
        return ajax("POST", `/app/order/scanCodePickUp`, {}, {codeDTO});
    }

    /**
     * @description 签收扫码获取数据
     * @param in query {string} code
     * @returns OrderRouterSegmentPageListVo
     */
    public static signScanCodeUsingGET(code: string): Promise<OrderRouterSegmentPageListVo> {
        return ajax("GET", `/app/order/signScanCode?code=${code}`, {}, {});
    }

    /**
     * @description 扫描二维码进入运单详情
     * @param in query {string} stowageNumber
     * @returns Stowage
     */
    public static scanStowageNumberUsingGET(stowageNumber: string): Promise<Stowage> {
        return ajax("GET", `/app/scanStowageNumber?stowageNumber=${stowageNumber}`, {}, {});
    }

    /**
     * @description 删除凭证
     * @param in path {number} attachmentId
     * @returns string
     */
    public static deleteVoucherUsingGET(attachmentId: number): Promise<string> {
        return ajax("GET", `/app/sendCar/deleteVoucher/{attachmentId}`, {attachmentId}, {});
    }

    /**
     * @description 获取凭证列表
     * @param in path {number} stowageOrderId
     * @returns Attachment[]
     */
    public static getAttachmentListUsingGET(stowageOrderId: number): Promise<Attachment[]> {
        return ajax("GET", `/app/sendCar/getAttachmentList/{stowageOrderId}`, {stowageOrderId}, {});
    }

    /**
     * @description 上传凭证
     * @param in body {AppUploadVoucherDTO} appUploadVoucherDTO
     * @returns string
     */
    public static uploadVoucherUsingPOST(appUploadVoucherDTO: AppUploadVoucherDTO): Promise<string> {
        return ajax("POST", `/app/sendCar/uploadVoucher`, {}, {appUploadVoucherDTO});
    }

    /**
     * @description 配载单列表
     * @param in body {PublicPagination} stowageQueryCondition
     * @returns Page<Stowage>
     */
    public static stowageListUsingPOST(stowageQueryCondition?: PublicPagination): Promise<Page<Stowage>> {
        return ajax("POST", `/app/stowage/list`, {}, {stowageQueryCondition});
    }
}
