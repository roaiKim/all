import { DriverExecutionEntrustCard, DriverExecutionTab, DriverExecutionTaskItem } from "@api/DriverExecutionService";
import { PICKUP_STAGES, RECEIPT_STAGES, StageInfo } from "../type";

/**
 * @description 汇总任务列表指定数值字段，没有有效数值时返回 null。
 * @param tasks 任务列表
 * @param field 需要汇总的字段
 * @returns 汇总值或 null
 */
export function sumMetric(tasks: DriverExecutionTaskItem[], field: keyof DriverExecutionTaskItem): number | null {
    let total = 0;
    let hasValue = false;
    tasks.forEach((task) => {
        const value = task[field];
        if (typeof value === "number") {
            total += value;
            hasValue = true;
        }
    });
    return hasValue ? total : null;
}

/**
 * @description 汇总任务列表指定数值字段，没有有效数值时返回 0。
 * @param tasks 任务列表
 * @param field 需要汇总的字段
 * @returns 汇总值
 */
export function countOf(tasks: DriverExecutionTaskItem[], field: keyof DriverExecutionTaskItem): number {
    return sumMetric(tasks, field) || 0;
}

/**
 * @description 格式化指标展示值，null 显示为 “-”，其余保留两位小数。
 * @param value 指标值
 * @returns 展示文案
 */
export function formatMetric(value: number | null): string {
    if (value === null) {
        return "-";
    }
    return String(Math.round(value * 100) / 100);
}

/**
 * @description 读取指定状态的统计数量，缺失或非数字时返回 0。
 * @param statistics 接口返回的统计 Map
 * @param key 状态 key
 * @returns 统计数量
 */
export function getStatValue(statistics: Record<string, number> | undefined, key: string): number {
    if (!statistics) {
        return 0;
    }
    const value = statistics[key] ?? statistics[key.toLowerCase()];
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
}

/**
 * @description 计算任务卡片状态：优先使用接口 displayStage，否则按件数推导。
 * @param record 运输委托卡片
 * @param tab 当前 Tab
 * @returns 状态文案和样式类型
 */
export function getStageInfo(record: DriverExecutionEntrustCard, tab: DriverExecutionTab): StageInfo {
    const tasks = record.tasks || [];
    const stageMap = tab === "PICKUP" ? PICKUP_STAGES : RECEIPT_STAGES;
    if (record.displayStage && stageMap[record.displayStage]) {
        return stageMap[record.displayStage];
    }

    const total = countOf(tasks, "totalPackageCount");
    if (tab === "PICKUP") {
        const completed = countOf(tasks, "completedPackageCount");
        if (total > 0 && completed >= total) {
            return PICKUP_STAGES.PICKED_UP;
        }
        return completed > 0 ? PICKUP_STAGES.WAIT_PICKUP : PICKUP_STAGES.WAIT_CHECK_IN;
    }

    const signed = countOf(tasks, "signedPackageCount");
    const pending = sumMetric(tasks, "pendingPackageCount");
    const rest = pending === null ? total - signed : pending;
    if (total > 0 && rest <= 0) {
        return RECEIPT_STAGES.RECEIVED;
    }
    return signed > 0 ? RECEIPT_STAGES.PARTIAL_RECEIPT : RECEIPT_STAGES.WAIT_RECEIPT;
}
