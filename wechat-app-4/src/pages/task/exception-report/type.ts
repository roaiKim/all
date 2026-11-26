import {
    DriverExecutionAttachment,
    DriverExecutionService$exceptionPrepare$Response,
    DriverExecutionService$exceptionReport$Response,
    DriverExecutionStage,
} from "@api/DriverExecutionService";

export const EXCEPTION_STAGE_LABELS: Record<DriverExecutionStage, string> = {
    PICKUP: "提货装车",
    SIGNOFF: "货物签收",
};

export interface State {
    entrustId: string;
    taskId: string;
    stage: DriverExecutionStage;
    prepare: DriverExecutionService$exceptionPrepare$Response | null;
    attachments: DriverExecutionAttachment[];
    reportResult: DriverExecutionService$exceptionReport$Response | null;
}
