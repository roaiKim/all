import {
    StowageAssignerDTO,
    StowageCountVO,
    PublicPagination,
    StowageDTO,
    FreightVolumeAdjustmentDTO,
    Attachment,
    Stowage,
    Page,
    CarryCargoManifestDTO,
    MatchQuotationVO,
    StowageQuotationMatchDTO,
    UpdateStowageDTO,
    ChooseSignDTO,
    AppUploadVoucherDTO,
} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAJAXService {
    /**
     * @description 指派运单调度人
     * @param in body {StowageAssignerDTO[]} stowageAssignerList
     * @returns boolean
     */
    public static assignerUsingPOST(stowageAssignerList: StowageAssignerDTO[]): Promise<boolean> {
        return ajax("POST", "/stowage/assigner", {}, {});
    }

    /**
     * @description 确认运单
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static confirmUsingPOST_1(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/confirm", {}, {});
    }

    /**
     * @description 取消确认运单
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static cancelConfirmUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/confirm/cancel", {}, {});
    }

    /**
     * @description 统计各个状态的运单数
     * @param in body {PublicPagination} queryCondition
     * @returns StowageCountVO
     */
    public static getCountUsingPOST_1(queryCondition: PublicPagination): Promise<StowageCountVO> {
        return ajax("POST", "/stowage/count", {}, {});
    }

    /**
     * @description 删除运单
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static deleteUsingPOST_4(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/delete", {}, {});
    }

    /**
     * @description 删除附件信息
     * @param in path{number} id
     * @returns string
     */
    public static deleteAttachmentUsingGET_1(id: number): Promise<string> {
        return ajax("GET", "/stowage/deleteAttachment/{id}", {}, {});
    }

    /**
     * @description 编辑运单
     * @param in body {StowageDTO[]} stowageDTOList
     * @returns boolean
     */
    public static editUsingPOST_1(stowageDTOList: StowageDTO[]): Promise<boolean> {
        return ajax("POST", "/stowage/edit", {}, {});
    }

    /**
     * @description 运量调整
     * @param in body {FreightVolumeAdjustmentDTO} freightVolumeAdjustmentDTO
     * @returns boolean
     */
    public static freightVolumeAdjustmentUsingPOST(freightVolumeAdjustmentDTO: FreightVolumeAdjustmentDTO): Promise<boolean> {
        return ajax("POST", "/stowage/freightVolumeAdjustment", {}, {});
    }

    /**
     * @description 根据派车单ID返回附件信息
     * @param in path{number} id
     * @returns Attachment[]
     */
    public static getAttachmentByIdUsingGET(id: number): Promise<Attachment[]> {
        return ajax("GET", "/stowage/getAttachmentById/{id}", {}, {});
    }

    /**
     * @description 获取配载单制单人信息
     * @returns {[key: string]: string}[]
     */
    public static getCreateUsersUsingGET(undefined): Promise<{[key: string]: string}[]> {
        return ajax("GET", "/stowage/getCreateUser", {}, {});
    }

    /**
     * @description 运单地图追踪
     * @param in path{number} id
     * @returns Stowage
     */
    public static getStowageMapTraceUsingGET(id: number): Promise<Stowage> {
        return ajax("GET", "/stowage/getStowageMapTrace/{id}", {}, {});
    }

    /**
     * @description 运单列表
     * @param in body {PublicPagination} queryCondition
     * @returns Page<Stowage>
     */
    public static listUsingPOST_4(queryCondition: PublicPagination): Promise<Page<Stowage>> {
        return ajax("POST", "/stowage/list", {}, {});
    }

    /**
     * @description 查询载货清单
     * @param in path{number} stowageId
     * @returns CarryCargoManifestDTO
     */
    public static queryManifestUsingPOST(stowageId: number): Promise<CarryCargoManifestDTO> {
        return ajax("POST", "/stowage/manifest/query/{stowageId}", {}, {});
    }

    /**
     * @description 添加载货清单
     * @param in body {CarryCargoManifestDTO} carryCargoManifestDTO
     * @returns object
     */
    public static addManifestUsingPOST(carryCargoManifestDTO: CarryCargoManifestDTO): Promise<object> {
        return ajax("POST", "/stowage/manifest/save", {}, {});
    }

    /**
     * @description 报价匹配
     * @param in body {StowageQuotationMatchDTO} stowageQuotationMatchDTO
     * @returns MatchQuotationVO
     */
    public static matchQuotationUsingPOST_1(stowageQuotationMatchDTO: StowageQuotationMatchDTO): Promise<MatchQuotationVO> {
        return ajax("POST", "/stowage/matchQuotation", {}, {});
    }

    /**
     * @description 运单列表修改数据
     * @param in body {UpdateStowageDTO} updateStowageDTO
     * @returns string
     */
    public static modifiedDataOfWaybillListUsingPOST(updateStowageDTO: UpdateStowageDTO): Promise<string> {
        return ajax("POST", "/stowage/modifiedDataOfWaybillList", {}, {});
    }

    /**
     * @description 新增运单
     * @param in body {StowageDTO[]} stowageDTOList
     * @returns number[]
     */
    public static saveUsingPOST_3(stowageDTOList: StowageDTO[]): Promise<number[]> {
        return ajax("POST", "/stowage/save", {}, {});
    }

    /**
     * @description 发运
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static shipmentUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/shipment", {}, {});
    }

    /**
     * @description 取消发运
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static cancelShipmentUsingPOST(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/shipment/cancel", {}, {});
    }

    /**
     * @description 签收
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static signUsingPOST_1(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/sign", {}, {});
    }

    /**
     * @description 取消签收
     * @param in body {number[]} ids
     * @returns boolean
     */
    public static cancelSignUsingPOST_1(ids: number[]): Promise<boolean> {
        return ajax("POST", "/stowage/sign/cancel", {}, {});
    }

    /**
     * @description 选择性签收 signType: 0-正常签收 1-退回签收
     * @param in body {ChooseSignDTO[]} chooseSignDTOS
     * @returns boolean
     */
    public static chooseSignUsingPOST(chooseSignDTOS: ChooseSignDTO[]): Promise<boolean> {
        return ajax("POST", "/stowage/sign/choose", {}, {});
    }

    /**
     * @description 回单上传
     * @param in body {Attachment[]} attachments
     * @returns boolean
     */
    public static uploadUsingPOST_1(attachments: Attachment[]): Promise<boolean> {
        return ajax("POST", "/stowage/upload", {}, {});
    }

    /**
     * @description 上传凭证
     * @param in body {AppUploadVoucherDTO} appUploadVoucherDTO
     * @returns string
     */
    public static uploadVoucherUsingPOST_1(appUploadVoucherDTO: AppUploadVoucherDTO): Promise<string> {
        return ajax("POST", "/stowage/uploadVoucher", {}, {});
    }

    /**
     * @description 获取运单详情
     * @param in path{number} id
     * @returns Stowage
     */
    public static getByIdUsingGET_2(id: number): Promise<Stowage> {
        return ajax("GET", "/stowage/{id}", {}, {});
    }
}
