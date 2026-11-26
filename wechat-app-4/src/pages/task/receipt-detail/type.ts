import {
    DriverExecutionAbnormalReasonOption,
    DriverExecutionAttachment,
    DriverExecutionPackageGroup,
    DriverExecutionReceiptTask,
    DriverExecutionSelectOption,
    DriverExecutionService$receiptValidate$Response,
} from "@api/DriverExecutionService";

export type ReceiptStageType = "pending" | "progress" | "done";

export interface ReceiptStageInfo {
    text: string;
    type: ReceiptStageType;
}

export const DEFAULT_SIGN_OPTIONS = [
    { value: 10, label: "正常签收" },
    { value: 20, label: "异常签收" },
    { value: 30, label: "已拒收" },
    { value: 40, label: "已拦截" },
];

export const DEFAULT_REASON_OPTIONS = [
    { value: "DAMAGE", label: "货物破损" },
    { value: "SHORTAGE", label: "货物短缺" },
    { value: "DEFORMED", label: "货物变形" },
    { value: "OTHER", label: "其他" },
];

export interface OrderDraft {
    signStatus: number;
    packageGroupIds: string[];
    selectedCount: number;
    remark: string;
    reasonCode: string;
}

export interface State {
    entrustId: string;
    entrustNo: string;
    tasks: DriverExecutionReceiptTask[];
    signStatusOptions: DriverExecutionSelectOption[];
    abnormalReasonOptions: DriverExecutionAbnormalReasonOption[];
    receiptFiles: Record<string, DriverExecutionAttachment[]>;
    receivableGroups: DriverExecutionPackageGroup[];
    validation: DriverExecutionService$receiptValidate$Response | null;
}
