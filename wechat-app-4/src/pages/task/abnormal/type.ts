import { TaskService$ExceptionCategory } from "@api/TaskService";

export interface State {
    name: string;
    entrustId: string;
    taskId: string;
    orderIds: string[];
    stage: "PICKUP" | "SIGNOFF";
    expectedVersion: string;
    categories: TaskService$ExceptionCategory[];
    requestId: string;
    loading: boolean;
}
