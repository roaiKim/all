import { Loading, Module, register } from "@core";
import {
    DriverExecutionAttachment,
    DriverExecutionService,
    DriverExecutionService$pickupCheckIn$Request,
    DriverExecutionService$pickupConfirm$Request,
} from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import { WithConfirm } from "@utils/decorator/WithConfirm";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialPickupDetailState: State = {
    entrustId: "",
    entrustNo: "",
    tasks: [],
    voucherFiles: [],
};

class PickupDetailModule extends Module<RootState, "pickupDetail"> {
    onEnter(params): void {
        this.setState({ entrustId: params.entrustId || "", entrustNo: params.entrustNo || "" });
        this.fetchDetail(params.entrustId);
    }

    @Loading()
    async fetchDetail(entrustId: string) {
        const response = await DriverExecutionService.getPickupDetail(entrustId);
        this.setState({ entrustNo: response.entrustNo || this.state.entrustNo || "", tasks: response.tasks || [] });
    }

    @Loading("voucherFiles")
    async fetchVoucherFiles(entrustId: string, taskId: string) {
        const response = await DriverExecutionService.queryFiles({ entrustId, taskId, purpose: "PICKUP" });
        this.setState({ voucherFiles: Array.isArray(response) ? response : response.files || response.records || [] });
    }

    @Loading("pickupAction")
    async checkIn(request: DriverExecutionService$pickupCheckIn$Request) {
        const response = await DriverExecutionService.pickupCheckIn(request);
        this.setState({ tasks: this.state.tasks.map((task) => (task.taskId === response.taskId ? { ...task, ...response } : task)) });
        Toast.text("签到成功");
    }

    @Loading("pickupAction")
    async confirmPickup(request: DriverExecutionService$pickupConfirm$Request) {
        const response = await DriverExecutionService.confirmPickup(request);
        this.setState({ tasks: this.state.tasks.map((task) => (task.taskId === response.taskId ? { ...task, ...response } : task)) });
        Toast.text(response.allPickupCompleted ? "全部提货完成" : "提货确认成功");
    }

    @Loading("pickupAction")
    async uploadVouchers(request: { entrustId: string; taskId: string; filePaths: string[] }) {
        let files = this.state.voucherFiles;
        for (const filePath of request.filePaths) {
            const file = await DriverExecutionService.uploadFile({
                entrustId: request.entrustId,
                taskId: request.taskId,
                purpose: "PICKUP",
                filePath,
            });
            files = [...files, file];
            this.setState({ voucherFiles: files });
        }
        Toast.text("凭证上传成功");
    }

    @WithConfirm("确认删除该提货凭证?")
    @Loading("pickupAction")
    async deleteVoucher(file: DriverExecutionAttachment) {
        await DriverExecutionService.deleteFile(file.attachmentId);
        this.setState({ voucherFiles: this.state.voucherFiles.filter((item) => item.attachmentId !== file.attachmentId) });
        Toast.text("已删除");
    }
}

const module = register(new PickupDetailModule("pickupDetail", initialPickupDetailState));
export const actions = module.getActions();

export default module.connect(Main);
