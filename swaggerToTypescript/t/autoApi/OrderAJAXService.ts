import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAJAXService {
    // 确认订单;
    public static confirmUsingPOST(): Promise<any> {
        return ajax("POST", "/order/confirm", {}, {});
    }

    // 取消确认;
    public static confirmCancelUsingPOST(): Promise<any> {
        return ajax("POST", "/order/confirm/cancel", {}, {});
    }

    // 取消确认检查;
    public static confirmCancelCheckUsingPOST(): Promise<any> {
        return ajax("POST", "/order/confirm/cancel/check", {}, {});
    }

    // 统计各个状态的订单数;
    public static getCountUsingPOST(): Promise<any> {
        return ajax("POST", "/order/count", {}, {});
    }

    // 删除订单;
    public static deleteUsingPOST_2(): Promise<any> {
        return ajax("POST", "/order/delete", {}, {});
    }

    // 删除附件信息;
    public static deleteAttachmentUsingGET(): Promise<any> {
        return ajax("GET", "/order/deleteAttachment/{id}", {}, {});
    }

    // 派送调整;
    public static deliveryAdjustmentUsingPOST(): Promise<any> {
        return ajax("POST", "/order/delivery/adjustment", {}, {});
    }

    // 编辑订单;
    public static editUsingPOST(): Promise<any> {
        return ajax("POST", "/order/edit", {}, {});
    }

    // 编辑附件信息;
    public static editAttachmentUsingPOST(): Promise<any> {
        return ajax("POST", "/order/editAttachment", {}, {});
    }

    // 导出模板;
    public static exportTemplateUsingGET(): Promise<any> {
        return ajax("GET", "/order/exportTemplate", {}, {});
    }

    // 导入订单;
    public static importOrderUsingPOST(): Promise<any> {
        return ajax("POST", "/order/importOrder", {}, {});
    }

    // 订单列表;
    public static listUsingPOST_2(): Promise<any> {
        return ajax("POST", "/order/list", {}, {});
    }

    // 报价匹配;
    public static matchQuotationUsingPOST(): Promise<any> {
        return ajax("POST", "/order/matchQuotation", {}, {});
    }

    // 订单回单列表;
    public static returnListUsingPOST(): Promise<any> {
        return ajax("POST", "/order/return/list", {}, {});
    }

    // 新增订单;
    public static saveUsingPOST_1(): Promise<any> {
        return ajax("POST", "/order/save", {}, {});
    }

    // 签收;
    public static signUsingPOST(): Promise<any> {
        return ajax("POST", "/order/sign", {}, {});
    }

    // 取消签收;
    public static cancelSignUsingPOST(): Promise<any> {
        return ajax("POST", "/order/sign/cancel", {}, {});
    }

    // 签收校验;
    public static signCheckUsingPOST(): Promise<any> {
        return ajax("POST", "/order/sign/check", {}, {});
    }

    // 强制签收;
    public static forceSignUsingPOST(): Promise<any> {
        return ajax("POST", "/order/sign/force", {}, {});
    }

    // 再配载;
    public static stowageAgainUsingPOST(): Promise<any> {
        return ajax("POST", "/order/stowage/again", {}, {});
    }

    // 完成配载;
    public static stowageFinishUsingPOST(): Promise<any> {
        return ajax("POST", "/order/stowage/finish", {}, {});
    }

    // 回单上传;
    public static uploadUsingPOST(): Promise<any> {
        return ajax("POST", "/order/upload", {}, {});
    }

    // 根据ID获取单个订单信息;
    public static getByIdUsingGET_1(): Promise<any> {
        return ajax("GET", "/order/{id}", {}, {});
    }
}
