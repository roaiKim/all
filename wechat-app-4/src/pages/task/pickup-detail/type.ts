import { DriverExecutionAttachment, DriverExecutionPickupTask } from "@api/DriverExecutionService";

export type PickupStageType = "pending" | "progress" | "done";

export interface PickupStageInfo {
    text: string;
    type: PickupStageType;
}

export const PICKUP_TASK_STAGES: Record<string, PickupStageInfo> = {
    WAIT_CHECK_IN: { text: "待签到", type: "pending" },
    WAIT_PICKUP: { text: "待提货", type: "progress" },
    PICKED_UP: { text: "已提货", type: "done" },
};

export interface PickupForm {
    deliveryCopies: number | null;
    containerNo: string;
    sealNo: string;
    tareWeight: number | null;
    cargoWeight: number | null;
    vgmWeight: number | null;
    vgmCorrectionReason: string;
}

export interface State {
    entrustId: string;
    entrustNo: string;
    tasks: DriverExecutionPickupTask[];
    voucherFiles: DriverExecutionAttachment[];
}
