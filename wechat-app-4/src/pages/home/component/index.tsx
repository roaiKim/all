import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { DriverExecutionEntrustCard, DriverExecutionTab } from "@api/DriverExecutionService";
import Empty from "@component/Empty";
import { actions } from "@pages/home";
import { View } from "@tarojs/components";
import { useReachBottom } from "@tarojs/taro";
import { RootState } from "@type/state";
import { pushHistory } from "@utils";
import { getStatValue } from "./helper";
import TaskCard from "./task-card";
import { PICKUP_FILTERS, PICKUP_STATS, RECEIPT_FILTERS, RECEIPT_STATS } from "../type";
import "./index.less";

function Home(props: ReturnType<typeof mapStateToProps>) {
    const { tab, status, records, statistics, loading, loadingMore, total, loaded } = props;
    const dispatch = useDispatch();
    const filters = tab === "PICKUP" ? PICKUP_FILTERS : RECEIPT_FILTERS;
    const statItems = tab === "PICKUP" ? PICKUP_STATS : RECEIPT_STATS;

    const switchTab = (nextTab: DriverExecutionTab) => {
        if (loading || loadingMore || nextTab === tab) {
            return;
        }
        dispatch(actions.switchTab(nextTab));
    };

    const switchStatus = (nextStatus: string) => {
        if (loading || loadingMore || nextStatus === status) {
            return;
        }
        dispatch(actions.switchStatus(nextStatus));
    };

    useReachBottom(() => {
        if (loading || loadingMore || records.length >= total) {
            return;
        }
        dispatch(actions.loadMore());
    });

    const getFirstTask = (record: DriverExecutionEntrustCard) => (record.tasks || [])[0];

    return (
        <View className="ro-home-page">
            <View className="task-tabs">
                <View className={`task-tab ${tab === "PICKUP" ? "active" : ""}`} onClick={() => switchTab("PICKUP")}>
                    提货装车
                </View>
                <View className={`task-tab ${tab === "RECEIPT" ? "active" : ""}`} onClick={() => switchTab("RECEIPT")}>
                    货物签收
                </View>
            </View>

            <View className="stat-row">
                {statItems.map((item) => (
                    <View
                        className={`stat-card ${status === item.status ? "active" : ""}`}
                        key={item.status}
                        onClick={() => switchStatus(item.status)}
                    >
                        <View className={`stat-value stat-${item.color}`}>{getStatValue(statistics, item.status)}</View>
                        <View className="stat-label">{item.label}</View>
                    </View>
                ))}
            </View>

            <View className="filter-row">
                {filters.map((filter) => (
                    <View
                        className={`filter-item ${status === filter.value ? "active" : ""}`}
                        key={filter.value}
                        onClick={() => switchStatus(filter.value)}
                    >
                        {filter.label}
                    </View>
                ))}
            </View>

            {(!loaded || loading) && records.length === 0 && <View className="list-tip">加载中...</View>}
            {loaded && !loading && records.length === 0 && <Empty title="暂无任务" />}

            {records.map((record) => {
                const firstTask = getFirstTask(record);
                return (
                    <TaskCard
                        key={`${record.entrustId}_${firstTask?.taskId || ""}`}
                        record={record}
                        tab={tab}
                        onOpen={() => {
                            if (!firstTask) {
                                return;
                            }
                            pushHistory(tab === "PICKUP" ? "/pages/task/pickup-detail/index" : "/pages/task/receipt-detail/index", {
                                entrustId: record.entrustId,
                                entrustNo: record.entrustNo || "",
                            });
                        }}
                        onException={() => {
                            if (!firstTask) {
                                return;
                            }
                            pushHistory("/pages/task/exception-report/index", {
                                entrustId: record.entrustId,
                                taskId: firstTask.taskId,
                                stage: tab === "PICKUP" ? "PICKUP" : "SIGNOFF",
                            });
                        }}
                        onCargo={() => {
                            if (!firstTask) {
                                return;
                            }
                            pushHistory("/pages/task/cargo-detail/index", {
                                entrustId: record.entrustId,
                                taskId: firstTask.taskId,
                                mode: tab === "PICKUP" ? "pickup" : "receipt",
                            });
                        }}
                        onRecords={() => {
                            if (!firstTask) {
                                return;
                            }
                            pushHistory("/pages/task/receipt-records/index", {
                                entrustId: record.entrustId,
                                taskId: firstTask.taskId,
                            });
                        }}
                    />
                );
            })}

            {records.length > 0 && (
                <View className="list-footer">{loadingMore ? "加载中..." : records.length >= total ? "没有更多了" : "上拉加载更多"}</View>
            )}
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        tab: state.app.home.tab,
        status: state.app.home.status,
        records: state.app.home.records,
        statistics: state.app.home.statistics,
        total: state.app.home.total,
        loaded: state.app.home.loaded,
        loading: showLoading(state, "taskList"),
        loadingMore: showLoading(state, "taskListMore"),
    };
};

export default connect(mapStateToProps)(Home);
