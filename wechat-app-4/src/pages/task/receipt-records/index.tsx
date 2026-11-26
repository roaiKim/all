import { Loading, Module, register } from "@core";
import { DriverExecutionService } from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import Main from "./component";
import { State } from "./type";

const PAGE_SIZE = 20;

const initialReceiptRecordsState: State = {
    entrustId: "",
    taskId: "",
    orderId: "",
    records: [],
    total: 0,
    pageNo: 1,
    detail: null,
};

class ReceiptRecordsModule extends Module<RootState, "receiptRecords"> {
    onEnter(params): void {
        this.setState({ entrustId: params.entrustId || "", taskId: params.taskId || "", orderId: params.orderId || "" });
        this.fetchRecords(1);
    }

    @Loading("receiptRecords")
    async fetchRecords(pageNo: number) {
        const response = await DriverExecutionService.getReceiptRecords({
            entrustId: this.state.entrustId,
            taskId: this.state.taskId,
            orderId: this.state.orderId,
            pageNo,
            pageSize: PAGE_SIZE,
        });
        this.setState({
            records: response.records || [],
            total: Number(response.total || 0),
            pageNo: Number(response.pageNo || pageNo),
        });
    }

    @Loading("receiptRecordsMore")
    async loadMore() {
        const pageNo = this.state.pageNo + 1;
        const response = await DriverExecutionService.getReceiptRecords({
            entrustId: this.state.entrustId,
            taskId: this.state.taskId,
            orderId: this.state.orderId,
            pageNo,
            pageSize: PAGE_SIZE,
        });
        this.setState({
            records: [...this.state.records, ...(response.records || [])],
            total: Number(response.total || 0),
            pageNo: Number(response.pageNo || pageNo),
        });
    }

    @Loading()
    async openDetail(podId: string) {
        this.setState({ detail: null });
        const detail = await DriverExecutionService.getReceiptRecord(podId);
        this.setState({ detail });
    }
}

const module = register(new ReceiptRecordsModule("receiptRecords", initialReceiptRecordsState));
export const actions = module.getActions();

export default module.connect(Main);
