import { TaskService$CargoPackageLine, TaskService$DetailResponse, TaskService$PickupPoint } from "@api/TaskService";

export interface State {
    name: string;
    businessTab: "pickupAndLoad";
    entrustId: string;
    taskId: string;
    detail: TaskService$DetailResponse | null;
    cargo: TaskService$CargoPackageLine[];
    selectedPoint: TaskService$PickupPoint | null;
    loading: boolean;
    errorMessage: string;
}
