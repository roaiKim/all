import { Loading, Module, register } from "@core";
import { DriverExecutionAttachment, DriverExecutionService, DriverExecutionService$exceptionReport$Request } from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import { WithConfirm } from "@utils/decorator/WithConfirm";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialExceptionReportState: State = {
    entrustId: "",
    taskId: "",
    stage: "PICKUP",
    prepare: null,
    attachments: [],
    reportResult: null,
};

class ExceptionReportModule extends Module<RootState, "exceptionReport"> {
    onEnter(params): void {
        this.setState({
            entrustId: params.entrustId || "",
            taskId: params.taskId || "",
            stage: params.stage === "SIGNOFF" ? "SIGNOFF" : "PICKUP",
        });
        this.fetchPrepare();
    }

    @Loading()
    async fetchPrepare() {
        const prepare = await DriverExecutionService.prepareException({
            entrustId: this.state.entrustId,
            taskId: this.state.taskId,
            stage: this.state.stage,
        });
        this.setState({ prepare, attachments: [], reportResult: null });
    }

    @Loading("exceptionAction")
    async uploadPhotos(entrustId: string, taskId: string, filePaths: string[]) {
        let files = this.state.attachments;
        for (const filePath of filePaths) {
            const file = await DriverExecutionService.uploadFile({ entrustId, taskId, purpose: "EXCEPTION", filePath });
            files = [...files, file];
            this.setState({ attachments: files });
        }
        Toast.text("照片上传成功");
    }

    @WithConfirm("确认删除该异常照片?")
    @Loading("exceptionAction")
    async removePhoto(file: DriverExecutionAttachment) {
        await DriverExecutionService.deleteFile(file.attachmentId);
        this.setState({ attachments: this.state.attachments.filter((item) => item.attachmentId !== file.attachmentId) });
        Toast.text("已删除");
    }

    @Loading("exceptionAction")
    async submit(request: DriverExecutionService$exceptionReport$Request) {
        const reportResult = await DriverExecutionService.reportException(request);
        this.setState({ reportResult });
    }

    clearReportResult() {
        this.setState({ reportResult: null });
    }
}

const module = register(new ExceptionReportModule("exceptionReport", initialExceptionReportState));
export const actions = module.getActions();

export default module.connect(Main);
