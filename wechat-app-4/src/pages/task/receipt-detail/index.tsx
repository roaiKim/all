import { Loading, Module, register } from "@core";
import {
    DriverExecutionAttachment,
    DriverExecutionPackageGroup,
    DriverExecutionReceiptOrder,
    DriverExecutionReceiptTask,
    DriverExecutionService,
    DriverExecutionService$receiptRequest,
} from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import { WithConfirm } from "@utils/decorator/WithConfirm";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialReceiptDetailState: State = {
    entrustId: "",
    entrustNo: "",
    tasks: [],
    signStatusOptions: [],
    abnormalReasonOptions: [],
    receiptFiles: {},
    receivableGroups: [],
    validation: null,
};

class ReceiptDetailModule extends Module<RootState, "receiptDetail"> {
    onEnter(params): void {
        this.setState({ entrustId: params.entrustId || "", entrustNo: params.entrustNo || "" });
        this.fetchDetail();
    }

    @Loading()
    async fetchDetail() {
        const response = await DriverExecutionService.getReceiptDetail(this.state.entrustId);
        this.setState({
            entrustNo: response.entrustNo || this.state.entrustNo || "",
            tasks: response.tasks || [],
            signStatusOptions: response.signStatusOptions || [],
            abnormalReasonOptions: response.abnormalReasonOptions || [],
            receiptFiles: {},
            receivableGroups: [],
            validation: null,
        });
    }

    @Loading("receiptAction")
    async fetchReceiptFiles(entrustId: string, taskId: string) {
        this.setState({ receiptFiles: {} });
        const task = this.state.tasks.find((item) => item.taskId === taskId);
        const orders = this.getTaskOrders(task);
        const responses = await Promise.all(
            orders.map((order) =>
                DriverExecutionService.queryFiles({
                    entrustId,
                    taskId,
                    orderId: order.orderId,
                    purpose: "RECEIPT",
                })
            )
        );

        const receiptFiles: Record<string, DriverExecutionAttachment[]> = {};
        responses.forEach((response, index) => {
            receiptFiles[orders[index].orderId] = Array.isArray(response) ? response : response.files || response.records || [];
        });
        this.setState({ receiptFiles });
    }

    @Loading("receiptAction")
    async fetchReceivableCargo(orderId: string, groups: DriverExecutionPackageGroup[]) {
        this.setState({ receivableGroups: groups });
        const response = await DriverExecutionService.getReceivableCargo(orderId);
        this.setState({ receivableGroups: response.packageGroups || groups });
    }

    @Loading("receiptAction")
    async uploadReceiptFiles(entrustId: string, taskId: string, orderId: string, filePaths: string[]) {
        for (const filePath of filePaths) {
            const file = await DriverExecutionService.uploadFile({ entrustId, taskId, orderId, purpose: "RECEIPT", filePath });
            this.setState({
                receiptFiles: { ...this.state.receiptFiles, [orderId]: [...(this.state.receiptFiles[orderId] || []), file] },
            });
        }
        Toast.text("凭证上传成功");
    }

    @WithConfirm("确认删除该签收凭证?")
    @Loading("receiptAction")
    async removeReceiptFile(orderId: string, file: DriverExecutionAttachment) {
        await DriverExecutionService.deleteFile(file.attachmentId);
        this.setState({
            receiptFiles: {
                ...this.state.receiptFiles,
                [orderId]: (this.state.receiptFiles[orderId] || []).filter((item) => item.attachmentId !== file.attachmentId),
            },
        });
        Toast.text("已删除");
    }

    @Loading("receiptSubmit")
    async validateReceipt(request: DriverExecutionService$receiptRequest) {
        const validation = await DriverExecutionService.validateReceipt(request);
        this.setState({ validation });
    }

    clearValidation() {
        this.setState({ validation: null });
    }

    @Loading("receiptSubmit")
    async confirmReceipt(request: DriverExecutionService$receiptRequest) {
        await DriverExecutionService.confirmReceipt(request);
        this.setState({ validation: null });
        Toast.text("签收成功");
        await this.fetchDetail();
        await this.fetchReceiptFiles(this.state.entrustId, request.taskId);
    }

    private getTaskOrders(task?: DriverExecutionReceiptTask): DriverExecutionReceiptOrder[] {
        const orders: DriverExecutionReceiptOrder[] = [];
        (task?.unloadPoints || []).forEach((point) => {
            (point.orders || []).forEach((order) => orders.push(order));
        });
        return orders;
    }
}

const module = register(new ReceiptDetailModule("receiptDetail", initialReceiptDetailState));
export const actions = module.getActions();

export default module.connect(Main);
