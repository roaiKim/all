import { StageType } from "../type";

export const stageType = Object.entries(StageType).map(([label, value]) => ({ value, label }));

// 分页规则
export const stagePaginationRules = [
    { value: 1, label: "默认" },
    { value: 2, label: "不分页" },
] as const;

export const stageShowState = [
    { value: 1, label: "显示" },
    { value: 0, label: "不显示" },
];

export const timeFormat = ["YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY", "YYYY/MM/DD HH:mm:ss", "YYYY-MM-DD"];
