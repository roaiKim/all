import { StageType } from "../type";

export const stageType = Object.entries(StageType).map(([label, value]) => ({ value, label }));

// 分页规则
export const stagePaginationRules = [
    { value: 1, label: "默认" },
    { value: 2, label: "不分页" },
] as const;
