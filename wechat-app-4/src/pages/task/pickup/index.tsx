import { captureError, Loading, Module, register } from "@core";
import { TaskService, TaskService$ConfirmPickupRequest, TaskService$PickupPoint } from "@api/TaskService";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import Main from "./component";
import { State } from "./type";

const initialState: State = {
    name: "taskPickupDetail",
    businessTab: "pickupAndLoad",
    entrustId: "",
    taskId: "",
    detail: null,
    cargo: [],
    selectedPoint: null,
    loading: false,
    errorMessage: "",
};

@verifiable
class TaskPickupDetailModule extends Module<RootState, "taskPickupDetail"> {
    onEnter(params: Record<string, string>) {
        this.setState({ entrustId: params?.entrustId || "", taskId: params?.taskId || "" });
        this.fetchDetail(params?.entrustId || "", params?.taskId || "");
    }

    onShow() {
        if (this.state.entrustId && !this.state.detail) {
            this.fetchDetail(this.state.entrustId, this.state.taskId);
        }
    }

    @Loading("taskPickupDetail")
    async fetchDetail(entrustId: string, taskId = "") {
        if (!entrustId) {
            this.setState({ errorMessage: "缺少运输委托编号" });
            return;
        }
        const response = await TaskService.getPickupDetail(entrustId, taskId).catch((error) => {
            captureError(error);
            this.setState({ errorMessage: "提货详情加载失败" });
            return null;
        });
        if (response) {
            this.setState({ detail: response, errorMessage: "" });
        }
    }

    @Loading("taskPickupDetail")
    async signIn(point: TaskService$PickupPoint & { taskId: string }) {
        const request = {
            entrustId: this.state.entrustId,
            taskId: point.taskId || this.state.taskId,
            pickupPointId: point.pickupPointId,
            requestId: `pickup_checkin_${Date.now()}`,
            expectedVersion: point.expectedVersion,
        };
        if (!request.taskId || !request.pickupPointId || !request.expectedVersion) {
            return;
        }
        await TaskService.checkIn(request).catch((error) => {
            captureError(error);
            return null;
        });
        await this.fetchDetail(this.state.entrustId, this.state.taskId);
    }

    @Loading("taskPickupDetail")
    async confirmPickup(input: Omit<TaskService$ConfirmPickupRequest, "entrustId" | "requestId">) {
        const response = await TaskService.confirmPickup({
            ...input,
            entrustId: this.state.entrustId,
            taskId: input.taskId || this.state.taskId,
            requestId: `pickup_confirm_${Date.now()}`,
        }).catch((error) => {
            captureError(error);
            return null;
        });
        if (response) {
            await this.fetchDetail(this.state.entrustId, this.state.taskId);
        }
    }

    @Loading("taskPickupDetail")
    async loadCargo(request: { taskId: string; pickupPointId: string }) {
        const response = await TaskService.queryCargo({
            entrustId: this.state.entrustId,
            taskId: request.taskId,
            pickupPointId: request.pickupPointId,
            orderId: null,
        }).catch((error) => {
            captureError(error);
            return null;
        });
        if (!response) {
            return;
        }
        const records = response.tasks.flatMap((task) =>
            task.orders.flatMap((order) => (order.packageLines.length ? order.packageLines : order.planLines))
        );
        this.setState({ cargo: records });
    }
}

const module = register(new TaskPickupDetailModule("taskPickupDetail", initialState));
export const actions = module.getActions();

export default module.connect(Main);
