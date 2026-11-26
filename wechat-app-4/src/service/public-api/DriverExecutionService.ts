import { APIException } from "@core";
import { ajax } from "@http";
import { getAuthorization, getCommonTanentId, getUrl } from "@http/static";
import Taro from "@tarojs/taro";

/** 司机端运输执行业务前缀，实际地址由 ajax 拼上 host + /api */
const PREFIX = "/tms/driverExecution";

export type DriverExecutionTab = "PICKUP" | "RECEIPT";
export type DriverExecutionViewMode = "ENTRUST" | "ORDER";
export type DriverExecutionStage = "PICKUP" | "SIGNOFF";
export type DriverExecutionFilePurpose = "PICKUP" | "RECEIPT" | "EXCEPTION";

/* -------------------------------------------------------------------------- */
/* Q01 首页 / 我的任务                                                        */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionService$tasksPage$Request {
    pageNo: number;
    pageSize: number;
    tab: DriverExecutionTab;
    viewMode?: DriverExecutionViewMode;
    status: string;
    keyword?: string;
}

export interface DriverExecutionTaskItem {
    taskId: string;
    taskNo: string;
    taskStatus?: number;
    logisticsNo?: string;
    truckNo?: string;
    driverName?: string;
    driverPhone?: string;
    planTime?: string;
    plannedArrivalTime?: string;
    totalPackageCount?: number;
    completedPackageCount?: number;
    signedPackageCount?: number;
    pendingPackageCount?: number;
    actualMaxPackageCount?: number;
    actualPalletCount?: number;
    actualLooseBoxCount?: number;
    actualBoxCount?: number;
    actualGrossWeight?: number;
    actualNetWeight?: number;
    actualVolume?: number;
    orderId?: string;
    orderNo?: string;
    orderStatus?: number;
    unloadPointId?: string;
    customerName?: string;
    consignee?: string;
    signStatus?: number;
    canSign?: boolean;
    blockedReason?: string;
}

export interface DriverExecutionEntrustCard {
    entrustId: string;
    entrustNo: string;
    entrustStatus?: number;
    displayStage?: string;
    planTime?: string;
    tasks: DriverExecutionTaskItem[];
}

export interface DriverExecutionService$tasksPage$Response {
    records: DriverExecutionEntrustCard[];
    total: number;
    pageNo: number;
    pageSize: number;
    tab?: DriverExecutionTab;
    viewMode?: DriverExecutionViewMode;
    statistics?: Record<string, number>;
    scope?: string;
}

/* -------------------------------------------------------------------------- */
/* Q02 / W01 / W02 / W03 提货                                                 */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionContainerMaterial {
    containerNo?: string;
    sealNo?: string;
    tareWeight?: number;
    cargoWeight?: number;
    vgmWeight?: number;
    vgmCorrectionReason?: string;
}

export interface DriverExecutionPickupPoint {
    pickupPointId: string;
    pointIdentitySource?: string;
    sequence?: number;
    name: string;
    address?: string;
    contact?: string;
    phone?: string;
    planTime?: string;
    orderIds?: string[];
    checkedIn?: boolean;
    checkedInAt?: string;
    pickupConfirmed?: boolean;
    actualPickupTime?: string;
    state?: string;
    canCheckIn?: boolean;
    canConfirmPickup?: boolean;
    deliveryCopies?: number;
    totalPackageCount?: number;
    actualMaxPackageCount?: number;
    actualPalletCount?: number;
    actualLooseBoxCount?: number;
    actualBoxCount?: number;
    actualGrossWeight?: number;
    actualNetWeight?: number;
    actualVolume?: number;
    transportRequirements?: string;
}

export interface DriverExecutionPickupTask {
    taskId: string;
    taskNo: string;
    logisticsNo?: string;
    truckNo?: string;
    driverName?: string;
    driverPhone?: string;
    plannedArrivalTime?: string;
    expectedVersion: string;
    displayStage?: string;
    routeValid?: boolean;
    blockedReason?: string;
    totalPoints?: number;
    completedPoints?: number;
    nextPickupPointId?: string;
    allPickupCompleted?: boolean;
    materialApplicable?: boolean;
    materialRequired?: boolean;
    voucherRequired?: boolean;
    canSaveContainerMaterial?: boolean;
    containerMaterial?: DriverExecutionContainerMaterial;
    deliveryCopies?: number;
    pickupPoints: DriverExecutionPickupPoint[];
}

export interface DriverExecutionService$pickupDetail$Response {
    entrustId: string;
    entrustNo: string;
    entrustStatus?: number;
    tasks: DriverExecutionPickupTask[];
}

export interface DriverExecutionService$pickupCheckIn$Request {
    entrustId: string;
    taskId: string;
    pickupPointId: string;
    requestId: string;
    expectedVersion: string;
}

export interface DriverExecutionService$pickupCheckIn$Response extends DriverExecutionPickupTask {
    entrustId?: string;
    entrustNo?: string;
}

export interface DriverExecutionService$pickupConfirm$Request {
    entrustId: string;
    taskId: string;
    pickupPointId: string;
    requestId: string;
    expectedVersion: string;
    deliveryCopies?: number;
    containerMaterial?: DriverExecutionContainerMaterial;
    attachmentIds?: string[];
}

export interface DriverExecutionService$pickupConfirm$Response extends DriverExecutionPickupTask {
    entrustId?: string;
    entrustNo?: string;
    confirmedPickupPointId?: string;
}

/* -------------------------------------------------------------------------- */
/* Q03 货物明细                                                               */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionPackageLine {
    packageId?: string;
    materialCode?: string;
    materialName?: string;
    customerPo?: string;
    pcs?: number;
    unit?: string;
    boxNo?: string;
    packingNo?: string;
    palletNo?: string;
    maxPackageType?: string;
    boxLengthMm?: number;
    boxWidthMm?: number;
    boxHeightMm?: number;
    boxWeightKg?: number;
    boxVolumeCbm?: number;
}

export interface DriverExecutionPlanLine {
    materialCode?: string;
    materialName?: string;
    pcs?: number;
    quantity?: number;
    unit?: string;
}

export interface DriverExecutionCargoOrder {
    orderId: string;
    orderNo?: string;
    unloadPointId?: string;
    customerName?: string;
    pickupAddress?: string;
    deliveryAddress?: string;
    cargoSource?: string;
    packageLines?: DriverExecutionPackageLine[];
    planLines?: DriverExecutionPlanLine[];
}

export interface DriverExecutionCargoTask {
    entrustId: string;
    taskId: string;
    taskNo: string;
    version?: string;
    orders: DriverExecutionCargoOrder[];
}

export interface DriverExecutionService$cargoQuery$Request {
    entrustId?: string;
    taskId?: string;
    orderId?: string | null;
    pickupPointId?: string;
    unloadPointId?: string;
}

export interface DriverExecutionService$cargoQuery$Response {
    tasks: DriverExecutionCargoTask[];
}

/* -------------------------------------------------------------------------- */
/* Q04 / Q05 / W05 / W06 签收                                                 */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionSelectOption {
    code?: number | string;
    value?: number | string;
    name?: string;
    label?: string;
}

export interface DriverExecutionAbnormalReasonOption {
    code?: string;
    reasonCode?: string;
    value?: string;
    name?: string;
    reasonName?: string;
    label?: string;
}

export interface DriverExecutionPackageGroupItem {
    itemCode?: string;
    itemName?: string;
    pcs?: number;
    customerProductCode?: string;
}

export interface DriverExecutionPackageGroup {
    packageGroupId: string;
    packageCount?: number;
    boxNo?: string;
    maxPackageSequence?: number;
    boxLength?: number;
    boxWidth?: number;
    boxHeight?: number;
    weight?: number;
    volume?: number;
    items?: DriverExecutionPackageGroupItem[];
}

export interface DriverExecutionReceiptOrder {
    orderId: string;
    orderNo?: string;
    unloadPointId?: string;
    customerName?: string;
    consignee?: string;
    status?: number;
    signStatus?: number;
    totalPackageCount?: number;
    signedPackageCount?: number;
    pendingPackageCount?: number;
    signingBasis?: string;
    packageGroups?: DriverExecutionPackageGroup[];
    canSign?: boolean;
    blockedReason?: string;
    transportRequirements?: string;
    measurementBasis?: string;
    measurementHint?: string;
}

export interface DriverExecutionUnloadPoint {
    unloadPointId: string;
    name: string;
    address?: string;
    contact?: string;
    phone?: string;
    orders: DriverExecutionReceiptOrder[];
}

export interface DriverExecutionReceiptTask {
    taskId: string;
    taskNo: string;
    logisticsNo?: string;
    truckNo?: string;
    driverName?: string;
    driverPhone?: string;
    plannedArrivalTime?: string;
    version: string;
    unloadPoints: DriverExecutionUnloadPoint[];
}

export interface DriverExecutionService$receiptDetail$Response {
    entrustId: string;
    entrustNo?: string;
    tasks: DriverExecutionReceiptTask[];
    signStatusOptions?: DriverExecutionSelectOption[];
    abnormalReasonOptions?: DriverExecutionAbnormalReasonOption[];
    receiptKindPolicy?: string;
    receiptKindHint?: string;
    interceptPolicy?: string;
    interceptHint?: string;
    attachmentPolicy?: string;
}

export interface DriverExecutionService$receivableCargo$Response extends DriverExecutionReceiptOrder {
    entrustId?: string;
    taskId?: string;
    version?: string;
}

export interface DriverExecutionReceiptOrderRequest {
    orderId: string;
    signStatus: number;
    remark?: string | null;
    reasonCode?: string | null;
    packageGroupIds: string[];
    attachmentIds?: string[];
}

export interface DriverExecutionService$receiptRequest {
    entrustId: string;
    taskId: string;
    unloadPointId: string;
    requestId: string;
    expectedVersion: string;
    signTime?: string;
    signer?: string;
    orders: DriverExecutionReceiptOrderRequest[];
}

export interface DriverExecutionService$receiptValidate$Response {
    valid: boolean;
    createsReceipt?: boolean;
    version?: string;
    orders?: unknown[];
    processedPackageCount?: number;
    actualPackageCount?: number;
    receiptKindPolicy?: string;
    msg?: string;
}

export interface DriverExecutionReceiptConfirmItem {
    podId?: string;
    podNo?: string;
    orderId?: string;
    signStatus?: number;
    processedPackageCount?: number;
    actualPackageCount?: number;
    receiptKind?: string;
    requiresClassification?: boolean;
}

export interface DriverExecutionService$receiptConfirm$Response {
    requestId?: string;
    receipts?: DriverExecutionReceiptConfirmItem[];
    processedPackageCount?: number;
    actualPackageCount?: number;
    signTime?: string;
    version?: string;
    entrustStatus?: number;
    taskStatus?: number;
}

/* -------------------------------------------------------------------------- */
/* Q06 / Q07 签收记录                                                         */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionService$receiptRecordsPage$Request {
    entrustId?: string;
    taskId?: string;
    orderId?: string;
    pageNo: number;
    pageSize: number;
}

export interface DriverExecutionService$receiptRecordsPage$Response {
    records: DriverExecutionReceiptRecord[];
    total: number;
    pageNo: number;
    pageSize: number;
}

export interface DriverExecutionReceiptRecord {
    podId: string;
    podNo?: string;
    orderId?: string;
    orderNo?: string;
    signTime?: string;
    recordedAt?: string;
    signer?: string;
    signStatus?: number;
    signStatusName?: string;
    remark?: string;
    processedPackageCount?: number;
    actualPackageCount?: number;
    signingBasis?: string;
    receiptKind?: string;
    receiptWorkflowStatus?: string;
    attachments?: DriverExecutionAttachment[];
}

export interface DriverExecutionReceiptRecordDetailLine {
    detailId?: string;
    boxNo?: string;
    maxPackageNo?: string;
    itemCode?: string;
    expectedPcs?: number;
    actualPcs?: number;
    signingBasis?: string;
}

export interface DriverExecutionService$receiptRecordDetail$Response extends DriverExecutionReceiptRecord {
    entrustId?: string;
    taskId?: string;
    version?: string;
    details?: DriverExecutionReceiptRecordDetailLine[];
}

/* -------------------------------------------------------------------------- */
/* Q08 / W04 异常上报                                                         */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionExceptionLevel {
    code: number;
    name: string;
}

export interface DriverExecutionExceptionCategory {
    code: string;
    name: string;
    enabled: boolean;
    disabledReason?: string;
    levels: DriverExecutionExceptionLevel[];
}

export interface DriverExecutionExceptionOrder {
    orderId: string;
    orderNumber?: string;
    materialCodes?: string[];
}

export interface DriverExecutionService$exceptionPrepare$Request {
    entrustId: string;
    taskId: string;
    orderIds?: string[];
    stage?: DriverExecutionStage;
}

export interface DriverExecutionService$exceptionPrepare$Response {
    entrustId: string;
    taskId: string;
    expectedVersion: string;
    stage?: string;
    orderScope?: string;
    orders?: DriverExecutionExceptionOrder[];
    categories?: DriverExecutionExceptionCategory[];
    levelRequired?: boolean;
    descriptionRequired?: boolean;
    evidenceRequired?: boolean;
    maxDescriptionLength?: number;
}

export interface DriverExecutionService$exceptionReport$Request {
    entrustId: string;
    taskId: string;
    orderIds?: string[];
    stage?: DriverExecutionStage;
    requestId: string;
    expectedVersion: string;
    categoryCode: string;
    level: number;
    description: string;
    attachmentIds?: string[];
    materialCodesByOrder?: Record<string, string[]>;
}

export interface DriverExecutionService$exceptionReport$Response {
    exceptionId?: string;
    exceptionNumber?: string;
    status?: number;
    statusName?: string;
    reportTime?: string;
    taskId?: string;
    orderIds?: string[];
    categoryCode?: string;
    level?: number;
    attachmentCount?: number;
    expectedVersion?: string;
}

/* -------------------------------------------------------------------------- */
/* F01 / F02 / F03 / F04 / F05 文件                                            */
/* -------------------------------------------------------------------------- */

export interface DriverExecutionAttachment {
    attachmentId: string;
    fileName?: string;
    fileSize?: number;
    purpose?: DriverExecutionFilePurpose;
    state?: string;
    orderId?: string;
    expiresAt?: string;
    canDelete?: boolean;
    canPreview?: boolean;
    canDownload?: boolean;
}

export interface DriverExecutionService$filesQuery$Request {
    entrustId: string;
    taskId: string;
    orderId?: string;
    podId?: string;
    purpose: DriverExecutionFilePurpose;
}

export type DriverExecutionService$filesQuery$Response =
    DriverExecutionAttachment[] | { files?: DriverExecutionAttachment[]; records?: DriverExecutionAttachment[] };

export interface DriverExecutionService$filesUpload$Request {
    entrustId: string;
    taskId: string;
    orderId?: string;
    purpose: DriverExecutionFilePurpose;
    filePath: string;
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

function buildAuthHeader() {
    return {
        Authorization: getAuthorization(),
        "Auth-Sub": "MINI_APP",
        "Comma-Tenant-id": getCommonTanentId(),
    };
}

export class DriverExecutionService {
    /* -------------------------------- 任务 --------------------------------- */

    static getTasksPage(request: DriverExecutionService$tasksPage$Request): Promise<DriverExecutionService$tasksPage$Response> {
        return ajax("POST", `${PREFIX}/tasks/page`, request, "JSON");
    }

    /* -------------------------------- 提货 --------------------------------- */

    static getPickupDetail(entrustId: string, taskId?: string): Promise<DriverExecutionService$pickupDetail$Response> {
        return ajax("GET", `${PREFIX}/entrusts/${entrustId}/pickup`, taskId ? { taskId } : {}, "JSON");
    }

    static pickupCheckIn(request: DriverExecutionService$pickupCheckIn$Request): Promise<DriverExecutionService$pickupCheckIn$Response> {
        return ajax("POST", `${PREFIX}/pickup-points/check-in`, request, "JSON");
    }

    static confirmPickup(request: DriverExecutionService$pickupConfirm$Request): Promise<DriverExecutionService$pickupConfirm$Response> {
        return ajax("POST", `${PREFIX}/pickup-points/confirm`, request, "JSON");
    }

    /* -------------------------------- 货物 --------------------------------- */

    static queryCargo(request: DriverExecutionService$cargoQuery$Request): Promise<DriverExecutionService$cargoQuery$Response> {
        return ajax("POST", `${PREFIX}/cargo/query`, request, "JSON");
    }

    /* -------------------------------- 签收 --------------------------------- */

    static getReceiptDetail(entrustId: string, taskId?: string, orderId?: string): Promise<DriverExecutionService$receiptDetail$Response> {
        const request: { taskId?: string; orderId?: string } = {};
        if (taskId) {
            request["taskId"] = taskId;
        }
        if (orderId) {
            request["orderId"] = orderId;
        }
        return ajax("GET", `${PREFIX}/entrusts/${entrustId}/receipts`, request, "JSON");
    }

    static getReceivableCargo(orderId: string): Promise<DriverExecutionService$receivableCargo$Response> {
        return ajax("GET", `${PREFIX}/orders/${orderId}/receivable-cargo`, {}, "JSON");
    }

    static getReceiptRecords(
        request: DriverExecutionService$receiptRecordsPage$Request
    ): Promise<DriverExecutionService$receiptRecordsPage$Response> {
        return ajax("POST", `${PREFIX}/receipt-records/page`, request, "JSON");
    }

    static getReceiptRecord(podId: string): Promise<DriverExecutionService$receiptRecordDetail$Response> {
        return ajax("GET", `${PREFIX}/receipt-records/${podId}`, {}, "JSON");
    }

    static validateReceipt(request: DriverExecutionService$receiptRequest): Promise<DriverExecutionService$receiptValidate$Response> {
        return ajax("POST", `${PREFIX}/receipts/validate`, request, "JSON");
    }

    static confirmReceipt(request: DriverExecutionService$receiptRequest): Promise<DriverExecutionService$receiptConfirm$Response> {
        return ajax("POST", `${PREFIX}/receipts/confirm`, request, "JSON");
    }

    /* -------------------------------- 异常 --------------------------------- */

    static prepareException(request: DriverExecutionService$exceptionPrepare$Request): Promise<DriverExecutionService$exceptionPrepare$Response> {
        return ajax("POST", `${PREFIX}/exceptions/prepare`, request, "JSON");
    }

    static reportException(request: DriverExecutionService$exceptionReport$Request): Promise<DriverExecutionService$exceptionReport$Response> {
        return ajax("POST", `${PREFIX}/exceptions/report`, request, "JSON");
    }

    /* -------------------------------- 文件 --------------------------------- */

    static queryFiles(request: DriverExecutionService$filesQuery$Request): Promise<DriverExecutionService$filesQuery$Response> {
        return ajax("POST", `${PREFIX}/files/query`, request, "JSON");
    }

    static deleteFile(attachmentId: string): Promise<void> {
        return ajax("DELETE", `${PREFIX}/files/${attachmentId}`, {}, "JSON");
    }

    static async uploadFile(request: DriverExecutionService$filesUpload$Request): Promise<DriverExecutionAttachment> {
        const path = `${PREFIX}/files/upload`;
        const response = await Taro.uploadFile({
            url: getUrl(path),
            filePath: request.filePath,
            name: "file",
            formData: {
                entrustId: request.entrustId,
                taskId: request.taskId,
                purpose: request.purpose,
                ...(request.orderId ? { orderId: request.orderId } : {}),
            },
            header: buildAuthHeader(),
        });

        let result: { code?: number; msg?: string; data?: DriverExecutionAttachment } = {};
        try {
            result = JSON.parse(response.data || "{}");
        } catch (error) {
            throw new APIException("文件上传响应解析失败", response.statusCode, path, response.data);
        }

        if (response.statusCode !== 200 || result.code !== 200) {
            throw new APIException(result.msg || "文件上传失败", result.code ?? response.statusCode, path, result);
        }
        return result.data;
    }

    static async downloadAttachment(attachmentId: string, mode: "preview" | "download"): Promise<string> {
        const path = `${PREFIX}/files/${attachmentId}/${mode}`;
        const response = await Taro.downloadFile({
            url: getUrl(path),
            header: buildAuthHeader(),
        });
        if (response.statusCode !== 200) {
            throw new APIException("文件获取失败", response.statusCode, path, response);
        }
        return response.tempFilePath;
    }
}
