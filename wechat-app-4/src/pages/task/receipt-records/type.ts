import { DriverExecutionReceiptRecord, DriverExecutionService$receiptRecordDetail$Response } from "@api/DriverExecutionService";

export type ReceiptRecordTagType = "pending" | "progress" | "done" | "error";

export const RECEIPT_RECORD_STATUS_TAGS: Record<number, { text: string; type: ReceiptRecordTagType }> = {
    10: { text: "正常签收", type: "done" },
    20: { text: "异常签收", type: "pending" },
    30: { text: "已拒收", type: "error" },
    40: { text: "已拦截", type: "progress" },
};

export interface State {
    entrustId: string;
    taskId: string;
    orderId: string;
    records: DriverExecutionReceiptRecord[];
    total: number;
    pageNo: number;
    detail: DriverExecutionService$receiptRecordDetail$Response | null;
}
