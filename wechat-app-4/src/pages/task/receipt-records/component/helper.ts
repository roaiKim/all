import dayjs from "dayjs";
import { DriverExecutionReceiptRecord } from "@api/DriverExecutionService";
import { RECEIPT_RECORD_STATUS_TAGS, ReceiptRecordTagType } from "../type";

/**
 * @description 根据签收状态码返回状态文案和标签样式。
 * @param record 签收记录
 * @returns 状态文案和标签类型
 */
export function getStatusTag(record: DriverExecutionReceiptRecord): { text: string; type: ReceiptRecordTagType } {
    const status = RECEIPT_RECORD_STATUS_TAGS[record.signStatus];
    return { text: record.signStatusName || status?.text || "-", type: status?.type || "progress" };
}

/**
 * @description 格式化签收时间，空值返回 “-”。
 * @param value 时间
 * @returns 格式化后的时间
 */
export function formatSignTime(value?: string | null): string {
    return value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-";
}
