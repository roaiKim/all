import { ajax } from "@http";

export type TaskBusinessTab = "pickupAndLoad" | "receipt";
export type TaskStatus = "ALL" | "WAIT_CHECK_IN" | "WAIT_PICKUP" | "PICKED_UP" | "WAIT_RECEIPT" | "PARTIAL_RECEIPT" | "RECEIVED";
export type TaskPageTab = "PICKUP" | "RECEIPT";
export type TaskViewMode = "ENTRUST" | "ORDER";
export type TaskExceptionStage = "PICKUP" | "SIGNOFF";

export interface TaskService$Statistics {
    ALL: number;
    WAIT_CHECK_IN?: number;
    WAIT_PICKUP?: number;
    PICKED_UP?: number;
    WAIT_RECEIPT?: number;
    PARTIAL_RECEIPT?: number;
    RECEIVED?: number;
}

export interface TaskService$TaskSummary {
    taskId: string;
    taskNo: string;
    taskStatus: TaskStatus;
    displayStage: TaskStatus;
    logisticsNo: string;
    truckNo: string;
    driverName: string;
    driverPhone: string;
    planTime: string | null;
    plannedArrivalTime: string | null;
    totalPackageCount: number | null;
    completedPackageCount: number | null;
    signedPackageCount: number | null;
    pendingPackageCount: number | null;
    actualGrossWeight: number | null;
    actualVolume: number | null;
    expectedVersion?: string;
    version?: string;
}

export interface TaskService$TaskPageRecord {
    entrustId: string;
    entrustNo: string;
    entrustStatus: string;
    displayStage: TaskStatus;
    planTime: string | null;
    tasks: TaskService$TaskSummary[];
    orderId?: string;
    orderNo?: string;
    orderStatus?: string;
    unloadPointId?: string;
    customerName?: string;
    consignee?: string;
    signStatus?: number;
    canSign?: boolean;
    blockedReason?: string | null;
    totalPackageCount?: number | null;
    completedPackageCount?: number | null;
    signedPackageCount?: number | null;
    pendingPackageCount?: number | null;
    actualGrossWeight?: number | null;
    actualVolume?: number | null;
}

export interface TaskService$getTasks$Request {
    pageNo: number;
    pageSize: number;
    tab: TaskPageTab;
    viewMode: TaskViewMode;
    status: TaskStatus;
    keyword: string;
}

export interface TaskService$getTasks$Response {
    records: TaskService$TaskPageRecord[];
    total: number;
    pageNo: number;
    pageSize: number;
    tab: TaskPageTab;
    viewMode: TaskViewMode;
    statistics: TaskService$Statistics;
    scope: "CURRENT_ASSIGNMENT";
}

export interface TaskService$DetailQueryRequest {
    taskId?: string;
    orderId?: string;
}

export interface TaskService$PickupPoint {
    pickupPointId: string;
    sequence: number;
    name: string;
    address: string;
    contact: string;
    phone: string;
    planTime: string | null;
    orderIds: string[];
    checkedIn: boolean;
    checkedInAt: string | null;
    pickupConfirmed: boolean;
    actualPickupTime: string | null;
    state: TaskStatus;
    canCheckIn: boolean;
    canConfirmPickup: boolean;
    deliveryCopies: number;
    expectedVersion: string;
    totalPackageCount: number | null;
    containerNo?: string;
    sealNo?: string;
    tareWeight?: number | null;
    cargoWeight?: number | null;
    vgmWeight?: number | null;
}

export interface TaskService$PackageGroup {
    packageGroupId: string;
    packageCount: number;
    boxNo?: string | null;
    maxPackageSequence?: number | null;
    boxLength?: number | null;
    boxWidth?: number | null;
    boxHeight?: number | null;
    weight?: number | null;
    volume?: number | null;
}

export interface TaskService$ReceiptOrder {
    orderId: string;
    orderNo: string;
    unloadPointId: string;
    customerName: string;
    consignee: string;
    status: string;
    signStatus: number;
    totalPackageCount: number | null;
    signedPackageCount: number | null;
    pendingPackageCount: number | null;
    canSign: boolean;
    blockedReason: string | null;
    packageGroups: TaskService$PackageGroup[];
}

export interface TaskService$UnloadPoint {
    unloadPointId: string;
    name: string;
    address: string;
    contact: string;
    phone: string;
    orders: TaskService$ReceiptOrder[];
}

export interface TaskService$DetailTask extends TaskService$TaskSummary {
    expectedVersion: string;
    version: string;
    pickupPoints: TaskService$PickupPoint[];
    unloadPoints: TaskService$UnloadPoint[];
    containerMaterial?: TaskService$ContainerMaterial;
}

export interface TaskService$DetailResponse {
    entrustId: string;
    entrustNo: string;
    entrustStatus: string;
    tasks: TaskService$DetailTask[];
}

export interface TaskService$CheckInRequest {
    entrustId: string;
    taskId: string;
    pickupPointId: string;
    requestId: string;
    expectedVersion: string;
}

export interface TaskService$ContainerMaterial {
    containerNo?: string;
    sealNo?: string;
    tareWeight?: number;
    cargoWeight?: number;
    vgmWeight?: number;
    vgmCorrectionReason?: string | null;
}

export interface TaskService$ConfirmPickupRequest {
    entrustId: string;
    taskId: string;
    pickupPointId: string;
    orderIds: string[];
    requestId: string;
    expectedVersion: string;
    deliveryCopies?: number;
    containerMaterial?: TaskService$ContainerMaterial;
    attachmentIds?: string[];
}

export interface TaskService$CargoQueryRequest {
    entrustId: string;
    taskId?: string;
    orderId?: string | null;
    pickupPointId?: string;
    unloadPointId?: string;
}

export interface TaskService$CargoPackageLine {
    packageId: string;
    materialCode: string;
    materialName: string;
    customerPo?: string | null;
    pcs: number | null;
    unit: string;
    boxNo?: string | null;
    packingNo?: string | null;
    palletNo?: string | null;
}

export interface TaskService$CargoOrder {
    orderId: string;
    orderNo: string;
    unloadPointId: string;
    packageLines: TaskService$CargoPackageLine[];
    planLines: TaskService$CargoPackageLine[];
}

export interface TaskService$CargoTask {
    entrustId: string;
    taskId: string;
    taskNo: string;
    version: string;
    orders: TaskService$CargoOrder[];
}

export interface TaskService$CargoQueryResponse {
    tasks: TaskService$CargoTask[];
}

export interface TaskService$ExceptionPrepareRequest {
    entrustId: string;
    taskId: string;
    orderIds?: string[];
    stage: TaskExceptionStage;
}

export interface TaskService$ExceptionLevel {
    code: number;
    name: string;
}

export interface TaskService$ExceptionCategory {
    code: string;
    name: string;
    enabled: boolean;
    disabledReason: string | null;
    levels: TaskService$ExceptionLevel[];
}

export interface TaskService$ExceptionPrepareResponse {
    entrustId: string;
    taskId: string;
    expectedVersion: string;
    stage: TaskExceptionStage;
    categories: TaskService$ExceptionCategory[];
    orders: Array<{ orderId: string; orderNumber: string; materialCodes: string[] }>;
    levelRequired: boolean;
    descriptionRequired: boolean;
    evidenceRequired: boolean;
    maxDescriptionLength: number;
}

export interface TaskService$ExceptionReportRequest {
    entrustId: string;
    taskId: string;
    stage: TaskExceptionStage;
    requestId: string;
    expectedVersion: string;
    categoryCode: string;
    level: number;
    description: string;
    orderIds?: string[];
    attachmentIds?: string[];
    materialCodesByOrder?: Record<string, string[]>;
}

export interface TaskService$ReceiptOrderRequest {
    orderId: string;
    signStatus: number;
    remark?: string | null;
    reasonCode?: string | null;
    packageGroupIds: string[];
    attachmentIds?: string[];
}

export interface TaskService$ReceiptRequest {
    entrustId: string;
    taskId: string;
    unloadPointId: string;
    requestId: string;
    expectedVersion: string;
    signTime?: string;
    signer?: string;
    orders: TaskService$ReceiptOrderRequest[];
}

export interface TaskService$ReceiptValidateResponse {
    valid: boolean;
    createsReceipt: false;
    version: string;
    orders: TaskService$ReceiptOrder[];
    processedPackageCount: number;
    actualPackageCount: number;
}

export interface TaskService$ReceiptConfirmResponse {
    requestId: string;
    receipts: Array<{
        podId: string;
        podNo: string;
        orderId: string;
        signStatus: number;
        processedPackageCount: number;
        actualPackageCount: number;
    }>;
    processedPackageCount: number;
    actualPackageCount: number;
    signTime: string;
    version: string;
}

export interface TaskService$ReceivableCargoResponse {
    entrustId: string;
    taskId: string;
    orderId: string;
    version: string;
    packageGroups: TaskService$PackageGroup[];
}

const getQuery = (request: TaskService$DetailQueryRequest): TaskService$DetailQueryRequest | undefined => {
    const query: TaskService$DetailQueryRequest = {};
    if (request.taskId) {
        query.taskId = request.taskId;
    }
    if (request.orderId) {
        query.orderId = request.orderId;
    }
    return Object.keys(query).length ? query : undefined;
};

export class TaskService {
    static getTasks(request: TaskService$getTasks$Request): Promise<TaskService$getTasks$Response> {
        return ajax("POST", "/tms/driverExecution/tasks/page", request);
    }

    static getPickupDetail(entrustId: string, taskId?: string): Promise<TaskService$DetailResponse> {
        return ajax("GET", `/tms/driverExecution/entrusts/${encodeURIComponent(entrustId)}/pickup`, getQuery({ taskId }));
    }

    static getReceiptDetail(entrustId: string, taskId?: string, orderId?: string): Promise<TaskService$DetailResponse> {
        return ajax("GET", `/tms/driverExecution/entrusts/${encodeURIComponent(entrustId)}/receipts`, getQuery({ taskId, orderId }));
    }

    static checkIn(request: TaskService$CheckInRequest): Promise<TaskService$DetailResponse> {
        return ajax("POST", "/tms/driverExecution/pickup-points/check-in", request);
    }

    static confirmPickup(request: TaskService$ConfirmPickupRequest): Promise<TaskService$DetailResponse> {
        return ajax("POST", "/tms/driverExecution/pickup-points/confirm", request);
    }

    static queryCargo(request: TaskService$CargoQueryRequest): Promise<TaskService$CargoQueryResponse> {
        return ajax("POST", "/tms/driverExecution/cargo/query", request);
    }

    static prepareException(request: TaskService$ExceptionPrepareRequest): Promise<TaskService$ExceptionPrepareResponse> {
        return ajax("POST", "/tms/driverExecution/exceptions/prepare", request);
    }

    static reportException(request: TaskService$ExceptionReportRequest): Promise<{ exceptionId: string; exceptionNumber: string; status: number }> {
        return ajax("POST", "/tms/driverExecution/exceptions/report", request);
    }

    static getReceivableCargo(orderId: string): Promise<TaskService$ReceivableCargoResponse> {
        return ajax("GET", `/tms/driverExecution/orders/${encodeURIComponent(orderId)}/receivable-cargo`);
    }

    static validateReceipt(request: TaskService$ReceiptRequest): Promise<TaskService$ReceiptValidateResponse> {
        return ajax("POST", "/tms/driverExecution/receipts/validate", request);
    }

    static confirmReceipt(request: TaskService$ReceiptRequest): Promise<TaskService$ReceiptConfirmResponse> {
        return ajax("POST", "/tms/driverExecution/receipts/confirm", request);
    }
}
