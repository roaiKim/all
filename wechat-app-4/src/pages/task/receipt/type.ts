import { TaskService$DetailResponse } from "@api/TaskService";

export interface State {
    name: string;
    businessTab: "receipt";
    entrustId: string;
    taskId: string;
    orderId: string;
    detail: TaskService$DetailResponse | null;
    loading: boolean;
    errorMessage: string;
}
