import { captureError, Loading, Module, register } from "@core";
import { TaskService, TaskService$ExceptionPrepareRequest } from "@api/TaskService";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import Main from "./component";
import { State } from "./type";

const initialState: State = {
    name: "taskAbnormal",
    entrustId: "",
    taskId: "",
    orderIds: [],
    stage: "PICKUP",
    expectedVersion: "",
    categories: [],
    requestId: "",
    loading: false,
};

@verifiable
class TaskAbnormalModule extends Module<RootState, "taskAbnormal"> {
    onEnter(params: Record<string, string>) {
        let orderIds: string[] = [];
        try {
            const parsed = params?.orderIds ? JSON.parse(params.orderIds) : [];
            orderIds = Array.isArray(parsed) ? parsed.map(String) : [];
        } catch (_error) {
            orderIds = [];
        }
        const stage = params?.stage === "SIGNOFF" ? "SIGNOFF" : "PICKUP";
        this.setState({
            entrustId: params?.entrustId || "",
            taskId: params?.taskId || "",
            orderIds,
            stage,
            requestId: `exception_${Date.now()}`,
        });
        this.prepare({ entrustId: params?.entrustId || "", taskId: params?.taskId || "", orderIds, stage });
    }

    @Loading("taskAbnormal")
    async prepare(request: TaskService$ExceptionPrepareRequest) {
        const response = await TaskService.prepareException(request).catch((error) => {
            captureError(error);
            return null;
        });
        if (!response) {
            return;
        }
        this.setState({
            expectedVersion: String(response.expectedVersion || ""),
            categories: response.categories,
        });
    }

    @Loading("taskAbnormal")
    async submit(categoryCode: string, level: number, description: string) {
        const response = await TaskService.reportException({
            entrustId: this.state.entrustId,
            taskId: this.state.taskId,
            stage: this.state.stage,
            requestId: this.state.requestId,
            expectedVersion: this.state.expectedVersion,
            categoryCode,
            level,
            description,
            ...(this.state.orderIds.length ? { orderIds: this.state.orderIds } : {}),
        }).catch((error) => {
            captureError(error);
            return null;
        });
        return response;
    }
}

const module = register(new TaskAbnormalModule("taskAbnormal", initialState));
export const actions = module.getActions();

export default module.connect(Main);
