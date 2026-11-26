import { DriverExecutionEntrustCard, DriverExecutionTab } from "@api/DriverExecutionService";

export type StageType = "pending" | "progress" | "done";

export interface StageInfo {
    text: string;
    type: StageType;
}

export const PICKUP_STAGES: Record<string, StageInfo> = {
    WAIT_CHECK_IN: { text: "待签到", type: "pending" },
    WAIT_PICKUP: { text: "待提货", type: "progress" },
    PICKED_UP: { text: "已提货", type: "done" },
};

export const RECEIPT_STAGES: Record<string, StageInfo> = {
    WAIT_RECEIPT: { text: "待签收", type: "pending" },
    PARTIAL_RECEIPT: { text: "部分签收", type: "progress" },
    RECEIVED: { text: "已签收", type: "done" },
};

export const PICKUP_FILTERS = [
    { value: "ALL", label: "全部" },
    { value: "WAIT_CHECK_IN", label: "待签到" },
    { value: "WAIT_PICKUP", label: "待提货" },
    { value: "PICKED_UP", label: "已提货" },
];

export const RECEIPT_FILTERS = [
    { value: "ALL", label: "全部" },
    { value: "WAIT_RECEIPT", label: "待签收" },
    { value: "PARTIAL_RECEIPT", label: "部分签收" },
    { value: "RECEIVED", label: "已签收" },
];

export const PICKUP_STATS = [
    { status: "WAIT_CHECK_IN", label: "待签到", color: "orange" },
    { status: "WAIT_PICKUP", label: "待提货", color: "blue" },
    { status: "PICKED_UP", label: "已提货", color: "green" },
];

export const RECEIPT_STATS = [
    { status: "WAIT_RECEIPT", label: "待签收", color: "orange" },
    { status: "PARTIAL_RECEIPT", label: "部分签收", color: "blue" },
    { status: "RECEIVED", label: "已签收", color: "green" },
];

export interface State {
    tab: DriverExecutionTab;
    status: string;
    records: DriverExecutionEntrustCard[];
    statistics: Record<string, number>;
    pageNo: number;
    total: number;
    loaded: boolean;
}
