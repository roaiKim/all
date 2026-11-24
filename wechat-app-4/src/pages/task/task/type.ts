import { TaskService$Statistics, TaskService$TaskPageRecord } from "@api/TaskService";

export type BusinessTab = "pickupAndLoad" | "receipt";
export type StatusFilter = "all" | "pendingSign" | "pendingPickup" | "picked";
export type TaskStage = Exclude<StatusFilter, "all">;

export interface TaskCard {
    source: TaskService$TaskPageRecord;
    id: string;
    entrustId: string;
    taskId: string;
    taskIds: string[];
    viewMode: "ENTRUST" | "ORDER";
    orderId?: string;
    stage: TaskStage;
    stageLabel: string;
    taskNumber: string;
    logisticsNo: string;
    plate: string;
    driver: string;
    driverPhone: string;
    pickupTime: string;
    totalQuantity: number;
    completedQuantity: number;
    pendingQuantity: number;
    cargoInfo: string;
}

export interface State {
    name: string;
    businessTab: BusinessTab;
    statusFilter: StatusFilter;
    dataSource: TaskCard[];
    statistics: TaskService$Statistics;
    pageNo: number;
    hasMore: boolean;
    errorMessage: string;
}
