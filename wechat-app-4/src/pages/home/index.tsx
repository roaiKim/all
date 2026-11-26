import { Loading, Module, register } from "@core";
import { DriverExecutionService, DriverExecutionTab } from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import Main from "./component";
import { State } from "./type";

const PAGE_SIZE = 20;

const initialHomeState: State = {
    tab: "PICKUP",
    status: "ALL",
    records: [],
    statistics: {},
    pageNo: 1,
    total: 0,
    loaded: false,
};

class HomeModule extends Module<RootState, "home"> {
    onShow() {
        this.fetchTasks(this.state.tab, this.state.status, 1);
    }

    switchTab(tab: DriverExecutionTab) {
        this.setState({ tab, status: "ALL", records: [], pageNo: 1, total: 0, statistics: {}, loaded: false });
        this.fetchTasks(tab, "ALL", 1);
    }

    switchStatus(status: string) {
        this.setState({ status, records: [], pageNo: 1, total: 0, loaded: false });
        this.fetchTasks(this.state.tab, status, 1);
    }

    @Loading("taskList")
    async fetchTasks(tab: DriverExecutionTab, status: string, pageNo: number) {
        const response = await DriverExecutionService.getTasksPage({
            pageNo,
            pageSize: PAGE_SIZE,
            tab,
            viewMode: "ENTRUST",
            status,
            keyword: "",
        });
        this.setState({
            records: response.records || [],
            statistics: response.statistics || {},
            pageNo: Number(response.pageNo || pageNo),
            total: Number(response.total || 0),
            loaded: true,
        });
    }

    @Loading("taskListMore")
    async loadMore() {
        const pageNo = this.state.pageNo + 1;
        const response = await DriverExecutionService.getTasksPage({
            pageNo,
            pageSize: PAGE_SIZE,
            tab: this.state.tab,
            viewMode: "ENTRUST",
            status: this.state.status,
            keyword: "",
        });
        this.setState({
            records: [...this.state.records, ...(response.records || [])],
            pageNo: Number(response.pageNo || pageNo),
            total: Number(response.total || 0),
        });
    }
}

const module = register(new HomeModule("home", initialHomeState));
export const actions = module.getActions();

export default module.connect(Main);
