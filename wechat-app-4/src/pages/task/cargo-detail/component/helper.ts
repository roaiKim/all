import { DriverExecutionPackageLine, DriverExecutionPlanLine } from "@api/DriverExecutionService";

/**
 * @description 拼接包装行的箱规和单箱重量，用于物料副标题。
 * @param line 包装明细行
 * @returns 箱规/重量文案
 */
export function getPackageExtra(line: DriverExecutionPackageLine): string {
    const size = line.boxLengthMm && line.boxWidthMm && line.boxHeightMm ? `${line.boxLengthMm}×${line.boxWidthMm}×${line.boxHeightMm}mm` : "";
    const weight = line.boxWeightKg === undefined || line.boxWeightKg === null ? "" : `${line.boxWeightKg}kg`;
    return [size, weight].filter(Boolean).join(" / ");
}

/**
 * @description 拼接计划物料的数量和单位。
 * @param line 计划物料行
 * @returns 数量文案
 */
export function getPlanQty(line: DriverExecutionPlanLine): string {
    const value = line.quantity ?? line.pcs;
    return `${value ?? "-"} ${line.unit || ""}`.trim();
}
