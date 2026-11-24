import { captureError, Loading, Module, register } from "@core";
import { TaskService, TaskService$TaskPageRecord, TaskStatus } from "@api/TaskService";
import { formatDateTime } from "@pages/task/shared";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import Main from "./component";
import { BusinessTab, State, StatusFilter, TaskCard, TaskStage } from "./type";

const initialTaskState: State = {
    name: "task",
    businessTab: "pickupAndLoad",
    statusFilter: "all",
    dataSource: [],
    statistics: { ALL: 0 },
    pageNo: 1,
    hasMore: true,
    errorMessage: "",
};

const getStage = (status: TaskStatus, tab: BusinessTab): TaskStage => {
    if (tab === "pickupAndLoad") {
        if (status === "WAIT_CHECK_IN") {
            return "pendingSign";
        }
        if (status === "WAIT_PICKUP") {
            return "pendingPickup";
        }
        return "picked";
    }
    if (status === "WAIT_RECEIPT") {
        return "pendingSign";
    }
    if (status === "PARTIAL_RECEIPT") {
        return "pendingPickup";
    }
    return "picked";
};

const buildTaskCard = (record: TaskService$TaskPageRecord, tab: BusinessTab): TaskCard => {
    const firstTask = record.tasks[0];
    const isReceipt = tab === "receipt";
    const stage = getStage(record.displayStage, tab);
    const totalQuantity = record.tasks.reduce((total, task) => total + (task.totalPackageCount ?? 0), 0) || (record.totalPackageCount ?? 0);
    const completedQuantityFromTasks = record.tasks.reduce(
        (total, task) => total + (isReceipt ? (task.signedPackageCount ?? 0) : (task.completedPackageCount ?? 0)),
        0
    );
    const completedQuantity = completedQuantityFromTasks || (isReceipt ? (record.signedPackageCount ?? 0) : (record.completedPackageCount ?? 0));
    const taskId = firstTask?.taskId || record.orderId || record.entrustId;
    const taskIds = record.tasks.map((task) => task.taskId);
    const labelMap: Record<TaskStage, string> = {
        pendingSign: isReceipt ? "待签收" : "待签到",
        pendingPickup: isReceipt ? "部分签收" : "待提货",
        picked: isReceipt ? "已签收" : "已提货",
    };
    const grossWeight = firstTask?.actualGrossWeight ?? record.actualGrossWeight;
    const volume = firstTask?.actualVolume ?? record.actualVolume;
    const id = record.orderId ? `${taskId}:${record.orderId}` : record.entrustId || taskId;

    return {
        source: record,
        id,
        entrustId: record.entrustId,
        taskId,
        taskIds,
        viewMode: isReceipt ? "ORDER" : "ENTRUST",
        orderId: record.orderId,
        stage,
        stageLabel: labelMap[stage],
        taskNumber: isReceipt ? record.orderNo || record.entrustNo : record.entrustNo || firstTask?.taskNo || "-",
        logisticsNo: firstTask?.logisticsNo || "-",
        plate: firstTask?.truckNo || "-",
        driver: firstTask?.driverName || "-",
        driverPhone: firstTask?.driverPhone || "",
        pickupTime: formatDateTime(isReceipt ? firstTask?.plannedArrivalTime : firstTask?.planTime || record.planTime),
        totalQuantity,
        completedQuantity,
        pendingQuantity: Math.max(totalQuantity - completedQuantity, 0),
        cargoInfo: `${totalQuantity || "-"}件 / ${grossWeight ?? "-"}kg / ${volume ?? "-"}CBM`,
    };
};

const statusCodeMap: Record<BusinessTab, Record<StatusFilter, TaskStatus>> = {
    pickupAndLoad: {
        all: "ALL",
        pendingSign: "WAIT_CHECK_IN",
        pendingPickup: "WAIT_PICKUP",
        picked: "PICKED_UP",
    },
    receipt: {
        all: "ALL",
        pendingSign: "WAIT_RECEIPT",
        pendingPickup: "PARTIAL_RECEIPT",
        picked: "RECEIVED",
    },
};

@verifiable
class TaskModule extends Module<RootState, "task"> {
    onShow() {
        this.refreshTasks();
    }

    async selectBusinessTab(value: BusinessTab) {
        if (this.state.businessTab === value) {
            return;
        }
        this.setState({ businessTab: value, statusFilter: "all" });
        await this.fetchTasks(true);
    }

    async selectStatusFilter(value: StatusFilter) {
        if (this.state.statusFilter === value) {
            return;
        }
        this.setState({ statusFilter: value });
        await this.fetchTasks(true);
    }

    async refreshTasks() {
        await this.fetchTasks(true);
    }

    async loadMore() {
        if (this.state.hasMore) {
            await this.fetchTasks(false);
        }
    }

    @Loading()
    async fetchTasks(reset: boolean) {
        if (!reset && !this.state.hasMore) {
            return;
        }
        const pageNo = reset ? 1 : this.state.pageNo + 1;
        const tab = this.state.businessTab;
        const response = await TaskService.getTasks({
            pageNo,
            pageSize: 20,
            tab: tab === "pickupAndLoad" ? "PICKUP" : "RECEIPT",
            viewMode: tab === "pickupAndLoad" ? "ENTRUST" : "ORDER",
            status: statusCodeMap[tab][this.state.statusFilter],
            keyword: "",
        }).catch((error) => {
            captureError(error);
            if (reset) {
                this.setState({ dataSource: [], hasMore: false, errorMessage: "任务加载失败" });
            } else {
                this.setState({ errorMessage: "任务加载失败" });
            }
            return null;
        });
        if (!response) {
            return;
        }
        const nextRecords = response.records.map((item) => buildTaskCard(item, tab));
        const dataSource = reset ? nextRecords : [...this.state.dataSource, ...nextRecords];
        this.setState({
            dataSource,
            statistics: response.statistics,
            pageNo,
            hasMore: nextRecords.length >= 20 && dataSource.length < response.total,
            errorMessage: "",
        });
    }
}

const module = register(new TaskModule("task", initialTaskState));
export const actions = module.getActions();

export default module.connect(Main);
