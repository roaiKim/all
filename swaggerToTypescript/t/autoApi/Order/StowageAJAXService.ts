import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAJAXService {
    // 指派运单调度人;
    public static assignerUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/assigner", {}, {});
    }

    // 确认运单;
    public static confirmUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/confirm", {}, {});
    }

    // 取消确认运单;
    public static cancelConfirmUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/confirm/cancel", {}, {});
    }

    // 统计各个状态的运单数;
    public static getCountUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/count", {}, {});
    }

    // 删除运单;
    public static deleteUsingPOST_4(): Promise<any> {
        return ajax("POST", "/stowage/delete", {}, {});
    }

    // 删除附件信息;
    public static deleteAttachmentUsingGET_1(): Promise<any> {
        return ajax("GET", "/stowage/deleteAttachment/{id}", {}, {});
    }

    // 编辑运单;
    public static editUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/edit", {}, {});
    }

    // 运量调整;
    public static freightVolumeAdjustmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/freightVolumeAdjustment", {}, {});
    }

    // 根据派车单ID返回附件信息;
    public static getAttachmentByIdUsingGET(): Promise<any> {
        return ajax("GET", "/stowage/getAttachmentById/{id}", {}, {});
    }

    // 获取配载单制单人信息;
    public static getCreateUsersUsingGET(): Promise<any> {
        return ajax("GET", "/stowage/getCreateUser", {}, {});
    }

    // 运单地图追踪;
    public static getStowageMapTraceUsingGET(): Promise<any> {
        return ajax("GET", "/stowage/getStowageMapTrace/{id}", {}, {});
    }

    // 运单列表;
    public static listUsingPOST_4(): Promise<any> {
        return ajax("POST", "/stowage/list", {}, {});
    }

    // 查询载货清单;
    public static queryManifestUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/manifest/query/{stowageId}", {}, {});
    }

    // 添加载货清单;
    public static addManifestUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/manifest/save", {}, {});
    }

    // 报价匹配;
    public static matchQuotationUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/matchQuotation", {}, {});
    }

    // 运单列表修改数据;
    public static modifiedDataOfWaybillListUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/modifiedDataOfWaybillList", {}, {});
    }

    // 新增运单;
    public static saveUsingPOST_3(): Promise<any> {
        return ajax("POST", "/stowage/save", {}, {});
    }

    // 发运;
    public static shipmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/shipment", {}, {});
    }

    // 取消发运;
    public static cancelShipmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/shipment/cancel", {}, {});
    }

    // 签收;
    public static signUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/sign", {}, {});
    }

    // 取消签收;
    public static cancelSignUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/sign/cancel", {}, {});
    }

    // 选择性签收 signType: 0-正常签收 1-退回签收;
    public static chooseSignUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage/sign/choose", {}, {});
    }

    // 回单上传;
    public static uploadUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/upload", {}, {});
    }

    // 上传凭证;
    public static uploadVoucherUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowage/uploadVoucher", {}, {});
    }

    // 获取运单详情;
    public static getByIdUsingGET_2(): Promise<any> {
        return ajax("GET", "/stowage/{id}", {}, {});
    }
}
