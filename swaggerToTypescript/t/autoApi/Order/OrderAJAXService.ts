import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAJAXService {
    /**
     * @description 确认订单
     * @returns boolean
     */
    public static confirmUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/confirm", {}, {});
    }

    /**
     * @description 取消确认
     * @returns boolean
     */
    public static confirmCancelUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/confirm/cancel", {}, {});
    }

    /**
     * @description 取消确认检查
     * @returns boolean
     */
    public static confirmCancelCheckUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/confirm/cancel/check", {}, {});
    }

    /**
     * @description 统计各个状态的订单数
     * @returns OrderCountVO
     */
    public static getCountUsingPOST(): Promise<OrderCountVO> {
        return ajax("POST", "/order/count", {}, {});
    }

    /**
     * @description 删除订单
     * @returns boolean
     */
    public static deleteUsingPOST_2(): Promise<boolean> {
        return ajax("POST", "/order/delete", {}, {});
    }

    /**
     * @description 删除附件信息
     * @returns string
     */
    public static deleteAttachmentUsingGET(): Promise<string> {
        return ajax("GET", "/order/deleteAttachment/{id}", {}, {});
    }

    /**
     * @description 派送调整
     * @returns number
     */
    public static deliveryAdjustmentUsingPOST(): Promise<number> {
        return ajax("POST", "/order/delivery/adjustment", {}, {});
    }

    /**
     * @description 编辑订单
     * @returns number
     */
    public static editUsingPOST(): Promise<number> {
        return ajax("POST", "/order/edit", {}, {});
    }

    /**
     * @description 编辑附件信息
     * @returns string
     */
    public static editAttachmentUsingPOST(): Promise<string> {
        return ajax("POST", "/order/editAttachment", {}, {});
    }

    /**
     * @description 导出模板
     * @returns void
     */
    public static exportTemplateUsingGET(): Promise<void> {
        return ajax("GET", "/order/exportTemplate", {}, {});
    }

    /**
     * @description 导入订单
     * @returns string
     */
    public static importOrderUsingPOST(): Promise<string> {
        return ajax("POST", "/order/importOrder", {}, {});
    }

    /**
     * @description 订单列表
     * @returns Page<Order>
     */
    public static listUsingPOST_2(): Promise<Page<Order>> {
        return ajax("POST", "/order/list", {}, {});
    }

    /**
     * @description 报价匹配
     * @returns MatchQuotationVO
     */
    public static matchQuotationUsingPOST(): Promise<MatchQuotationVO> {
        return ajax("POST", "/order/matchQuotation", {}, {});
    }

    /**
     * @description 订单回单列表
     * @returns Page<Order>
     */
    public static returnListUsingPOST(): Promise<Page<Order>> {
        return ajax("POST", "/order/return/list", {}, {});
    }

    /**
     * @description 新增订单
     * @returns number
     */
    public static saveUsingPOST_1(): Promise<number> {
        return ajax("POST", "/order/save", {}, {});
    }

    /**
     * @description 签收
     * @returns boolean
     */
    public static signUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/sign", {}, {});
    }

    /**
     * @description 取消签收
     * @returns boolean
     */
    public static cancelSignUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/sign/cancel", {}, {});
    }

    /**
     * @description 签收校验
     * @returns boolean
     */
    public static signCheckUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/sign/check", {}, {});
    }

    /**
     * @description 强制签收
     * @returns boolean
     */
    public static forceSignUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/sign/force", {}, {});
    }

    /**
     * @description 再配载
     * @returns boolean
     */
    public static stowageAgainUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/stowage/again", {}, {});
    }

    /**
     * @description 完成配载
     * @returns boolean
     */
    public static stowageFinishUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/stowage/finish", {}, {});
    }

    /**
     * @description 回单上传
     * @returns boolean
     */
    public static uploadUsingPOST(): Promise<boolean> {
        return ajax("POST", "/order/upload", {}, {});
    }

    /**
     * @description 根据ID获取单个订单信息
     * @returns Order
     */
    public static getByIdUsingGET_1(): Promise<Order> {
        return ajax("GET", "/order/{id}", {}, {});
    }
}
