import { captureError, Loading, Module, register } from "@core";
import { TaskService, TaskService$ReceiptRequest } from "@api/TaskService";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import Main from "./component";
import { State } from "./type";

const initialState: State = {
    name: "taskReceiptDetail",
    businessTab: "receipt",
    entrustId: "",
    taskId: "",
    orderId: "",
    detail: null,
    loading: false,
    errorMessage: "",
};

@verifiable
class TaskReceiptDetailModule extends Module<RootState, "taskReceiptDetail"> {
    onEnter(params: Record<string, string>) {
        this.setState({ entrustId: params?.entrustId || "", taskId: params?.taskId || "", orderId: params?.orderId || "" });
        this.fetchDetail(params?.entrustId || "", params?.taskId || "", params?.orderId || "");
    }

    onShow() {
        if (this.state.entrustId && !this.state.detail) {
            this.fetchDetail(this.state.entrustId, this.state.taskId, this.state.orderId);
        }
    }

    @Loading("taskReceiptDetail")
    async fetchDetail(entrustId: string, taskId = "", orderId = "") {
        if (!entrustId) {
            this.setState({ errorMessage: "缺少运输委托编号" });
            return;
        }
        const response = await TaskService.getReceiptDetail(entrustId, taskId, orderId).catch((error) => {
            captureError(error);
            this.setState({ errorMessage: "签收详情加载失败" });
            return null;
        });
        if (response) {
            this.setState({ detail: response, errorMessage: "" });
        }
    }

    @Loading("taskReceiptDetail")
    async confirmReceipt(input: Omit<TaskService$ReceiptRequest, "entrustId" | "requestId">) {
        const validateResponse = await TaskService.validateReceipt({
            ...input,
            entrustId: this.state.entrustId,
            requestId: `receipt_validate_${Date.now()}`,
        }).catch((error) => {
            captureError(error);
            return null;
        });
        if (!validateResponse?.valid) {
            return;
        }
        const response = await TaskService.confirmReceipt({
            ...input,
            entrustId: this.state.entrustId,
            expectedVersion: validateResponse.version || input.expectedVersion,
            requestId: `receipt_confirm_${Date.now()}`,
        }).catch((error) => {
            captureError(error);
            return null;
        });
        if (response) {
            await this.fetchDetail(this.state.entrustId, this.state.taskId, this.state.orderId);
        }
    }
}

const module = register(new TaskReceiptDetailModule("taskReceiptDetail", initialState));
export const actions = module.getActions();

export default module.connect(Main);
