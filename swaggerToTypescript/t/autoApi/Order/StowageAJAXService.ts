import {StowageCountVO, Attachment, Stowage, Page, CarryCargoManifestDTO, MatchQuotationVO} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAJAXService {
    /**
     * @description 指派运单调度人
     * @returns boolean
     */
    public static assignerUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/assigner", {}, {});
    }

    /**
     * @description 确认运单
     * @returns boolean
     */
    public static confirmUsingPOST_1(): Promise<boolean> {
        return ajax("POST", "/stowage/confirm", {}, {});
    }

    /**
     * @description 取消确认运单
     * @returns boolean
     */
    public static cancelConfirmUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/confirm/cancel", {}, {});
    }

    /**
     * @description 统计各个状态的运单数
     * @returns StowageCountVO
     */
    public static getCountUsingPOST_1(): Promise<StowageCountVO> {
        return ajax("POST", "/stowage/count", {}, {});
    }

    /**
     * @description 删除运单
     * @returns boolean
     */
    public static deleteUsingPOST_4(): Promise<boolean> {
        return ajax("POST", "/stowage/delete", {}, {});
    }

    /**
     * @description 删除附件信息
     * @returns string
     */
    public static deleteAttachmentUsingGET_1(): Promise<string> {
        return ajax("GET", "/stowage/deleteAttachment/{id}", {}, {});
    }

    /**
     * @description 编辑运单
     * @returns boolean
     */
    public static editUsingPOST_1(): Promise<boolean> {
        return ajax("POST", "/stowage/edit", {}, {});
    }

    /**
     * @description 运量调整
     * @returns boolean
     */
    public static freightVolumeAdjustmentUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/freightVolumeAdjustment", {}, {});
    }

    /**
     * @description 根据派车单ID返回附件信息
     * @returns Attachment[]
     */
    public static getAttachmentByIdUsingGET(): Promise<Attachment[]> {
        return ajax("GET", "/stowage/getAttachmentById/{id}", {}, {});
    }

    /**
     * @description 获取配载单制单人信息
     * @returns {[key: string]: string}[]
     */
    public static getCreateUsersUsingGET(): Promise<{[key: string]: string}[]> {
        return ajax("GET", "/stowage/getCreateUser", {}, {});
    }

    /**
     * @description 运单地图追踪
     * @returns Stowage
     */
    public static getStowageMapTraceUsingGET(): Promise<Stowage> {
        return ajax("GET", "/stowage/getStowageMapTrace/{id}", {}, {});
    }

    /**
     * @description 运单列表
     * @returns Page<Stowage>
     */
    public static listUsingPOST_4(): Promise<Page<Stowage>> {
        return ajax("POST", "/stowage/list", {}, {});
    }

    /**
     * @description 查询载货清单
     * @returns CarryCargoManifestDTO
     */
    public static queryManifestUsingPOST(): Promise<CarryCargoManifestDTO> {
        return ajax("POST", "/stowage/manifest/query/{stowageId}", {}, {});
    }

    /**
     * @description 添加载货清单
     * @returns object
     */
    public static addManifestUsingPOST(): Promise<object> {
        return ajax("POST", "/stowage/manifest/save", {}, {});
    }

    /**
     * @description 报价匹配
     * @returns MatchQuotationVO
     */
    public static matchQuotationUsingPOST_1(): Promise<MatchQuotationVO> {
        return ajax("POST", "/stowage/matchQuotation", {}, {});
    }

    /**
     * @description 运单列表修改数据
     * @returns string
     */
    public static modifiedDataOfWaybillListUsingPOST(): Promise<string> {
        return ajax("POST", "/stowage/modifiedDataOfWaybillList", {}, {});
    }

    /**
     * @description 新增运单
     * @returns number[]
     */
    public static saveUsingPOST_3(): Promise<number[]> {
        return ajax("POST", "/stowage/save", {}, {});
    }

    /**
     * @description 发运
     * @returns boolean
     */
    public static shipmentUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/shipment", {}, {});
    }

    /**
     * @description 取消发运
     * @returns boolean
     */
    public static cancelShipmentUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/shipment/cancel", {}, {});
    }

    /**
     * @description 签收
     * @returns boolean
     */
    public static signUsingPOST_1(): Promise<boolean> {
        return ajax("POST", "/stowage/sign", {}, {});
    }

    /**
     * @description 取消签收
     * @returns boolean
     */
    public static cancelSignUsingPOST_1(): Promise<boolean> {
        return ajax("POST", "/stowage/sign/cancel", {}, {});
    }

    /**
     * @description 选择性签收 signType: 0-正常签收 1-退回签收
     * @returns boolean
     */
    public static chooseSignUsingPOST(): Promise<boolean> {
        return ajax("POST", "/stowage/sign/choose", {}, {});
    }

    /**
     * @description 回单上传
     * @returns boolean
     */
    public static uploadUsingPOST_1(): Promise<boolean> {
        return ajax("POST", "/stowage/upload", {}, {});
    }

    /**
     * @description 上传凭证
     * @returns string
     */
    public static uploadVoucherUsingPOST_1(): Promise<string> {
        return ajax("POST", "/stowage/uploadVoucher", {}, {});
    }

    /**
     * @description 获取运单详情
     * @returns Stowage
     */
    public static getByIdUsingGET_2(): Promise<Stowage> {
        return ajax("GET", "/stowage/{id}", {}, {});
    }
}
