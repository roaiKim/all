import {
    OrderCountVO,
    PublicPagination,
    OrderReceiver,
    OrderDTO,
    ReceiptFileVo,
    ImportOrderDTO,
    Page,
    Order,
    MatchQuotationVO,
    OrderQuotationMatchDTO,
    Attachment,
} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAJAXService {
    /**
     * @description 确认订单
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static confirmUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/confirm", {}, {});
    }

    /**
     * @description 取消确认
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static confirmCancelUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/confirm/cancel", {}, {});
    }

    /**
     * @description 取消确认检查
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static confirmCancelCheckUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/confirm/cancel/check", {}, {});
    }

    /**
     * @description 统计各个状态的订单数
     * @param in body {PublicPagination} queryCondition
     * @returns OrderCountVO
     */
    public static getCountUsingPOST(queryCondition: PublicPagination): Promise<OrderCountVO> {
        return ajax("POST", "/order/count", {}, {});
    }

    /**
     * @description 删除订单
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static deleteUsingPOST_2(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/delete", {}, {});
    }

    /**
     * @description 删除附件信息
     * @param in path{number} id
     * @returns string
     */
    public static deleteAttachmentUsingGET(id: number): Promise<string> {
        return ajax("GET", "/order/deleteAttachment/{id}", {}, {});
    }

    /**
     * @description 派送调整
     * @param in body {OrderReceiver[]} receivers
     * @returns number
     */
    public static deliveryAdjustmentUsingPOST(receivers: OrderReceiver[]): Promise<number> {
        return ajax("POST", "/order/delivery/adjustment", {}, {});
    }

    /**
     * @description 编辑订单
     * @param in body {OrderDTO} orderDTO
     * @returns number
     */
    public static editUsingPOST(orderDTO: OrderDTO): Promise<number> {
        return ajax("POST", "/order/edit", {}, {});
    }

    /**
     * @description 编辑附件信息
     * @param in body {ReceiptFileVo} fileVo
     * @returns string
     */
    public static editAttachmentUsingPOST(fileVo: ReceiptFileVo): Promise<string> {
        return ajax("POST", "/order/editAttachment", {}, {});
    }

    /**
     * @description 导出模板
     * @returns void
     */
    public static exportTemplateUsingGET(undefined): Promise<void> {
        return ajax("GET", "/order/exportTemplate", {}, {});
    }

    /**
     * @description 导入订单
     * @param in body {ImportOrderDTO[]} orderDTO
     * @returns string
     */
    public static importOrderUsingPOST(orderDTO: ImportOrderDTO[]): Promise<string> {
        return ajax("POST", "/order/importOrder", {}, {});
    }

    /**
     * @description 订单列表
     * @param in body {PublicPagination} queryCondition
     * @returns Page<Order>
     */
    public static listUsingPOST_2(queryCondition: PublicPagination): Promise<Page<Order>> {
        return ajax("POST", "/order/list", {}, {});
    }

    /**
     * @description 报价匹配
     * @param in body {OrderQuotationMatchDTO} orderQuotationMatchDTO
     * @returns MatchQuotationVO
     */
    public static matchQuotationUsingPOST(orderQuotationMatchDTO: OrderQuotationMatchDTO): Promise<MatchQuotationVO> {
        return ajax("POST", "/order/matchQuotation", {}, {});
    }

    /**
     * @description 订单回单列表
     * @param in body {PublicPagination} queryCondition
     * @returns Page<Order>
     */
    public static returnListUsingPOST(queryCondition: PublicPagination): Promise<Page<Order>> {
        return ajax("POST", "/order/return/list", {}, {});
    }

    /**
     * @description 新增订单
     * @param in body {OrderDTO} orderDTO
     * @returns number
     */
    public static saveUsingPOST_1(orderDTO: OrderDTO): Promise<number> {
        return ajax("POST", "/order/save", {}, {});
    }

    /**
     * @description 签收
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static signUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/sign", {}, {});
    }

    /**
     * @description 取消签收
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static cancelSignUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/sign/cancel", {}, {});
    }

    /**
     * @description 签收校验
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static signCheckUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/sign/check", {}, {});
    }

    /**
     * @description 强制签收
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static forceSignUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/sign/force", {}, {});
    }

    /**
     * @description 再配载
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static stowageAgainUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/stowage/again", {}, {});
    }

    /**
     * @description 完成配载
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static stowageFinishUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/order/stowage/finish", {}, {});
    }

    /**
     * @description 回单上传
     * @param in body {Attachment[]} attachments
     * @returns boolean
     */
    public static uploadUsingPOST(attachments: Attachment[]): Promise<boolean> {
        return ajax("POST", "/order/upload", {}, {});
    }

    /**
     * @description 根据ID获取单个订单信息
     * @param in path{number} id
     * @returns Order
     */
    public static getByIdUsingGET_1(id: number): Promise<Order> {
        return ajax("GET", "/order/{id}", {}, {});
    }
}
