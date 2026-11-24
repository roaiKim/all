import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { AtButton, AtIcon } from "taro-ui";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { pushHistory } from "@utils";
import { actions } from "../index";
import { BusinessTab, State, StatusFilter, TaskCard } from "../type";
import "./index.less";

interface TaskProps {
    state: State;
}

const businessTabs: Array<{ key: BusinessTab; label: string }> = [
    { key: "pickupAndLoad", label: "提货装车" },
    { key: "receipt", label: "货物签收" },
];

const statusLabels: Record<BusinessTab, Record<StatusFilter, string>> = {
    pickupAndLoad: { all: "全部", pendingSign: "待签到", pendingPickup: "待提货", picked: "已提货" },
    receipt: { all: "全部", pendingSign: "待签收", pendingPickup: "部分签收", picked: "已签收" },
};

function Task(props: TaskProps) {
    const { state } = props;
    const dispatch = useDispatch();
    const [pageHeight, setPageHeight] = useState(500);

    useEffect(() => {
        const systemInfo = Taro.getSystemInfoSync();
        setPageHeight(Math.max((systemInfo.windowHeight || 667) - 116, 360));
    }, []);

    const summaryItems = [
        {
            key: "pendingSign" as const,
            label: statusLabels[state.businessTab].pendingSign,
            count:
                state.statistics[state.businessTab === "pickupAndLoad" ? "WAIT_CHECK_IN" : "WAIT_RECEIPT"] ??
                state.dataSource.filter((task) => task.stage === "pendingSign").length,
            color: "#f56b1f",
        },
        {
            key: "pendingPickup" as const,
            label: statusLabels[state.businessTab].pendingPickup,
            count:
                state.statistics[state.businessTab === "pickupAndLoad" ? "WAIT_PICKUP" : "PARTIAL_RECEIPT"] ??
                state.dataSource.filter((task) => task.stage === "pendingPickup").length,
            color: "#3478ed",
        },
        {
            key: "picked" as const,
            label: statusLabels[state.businessTab].picked,
            count:
                state.statistics[state.businessTab === "pickupAndLoad" ? "PICKED_UP" : "RECEIVED"] ??
                state.dataSource.filter((task) => task.stage === "picked").length,
            color: "#1bb750",
        },
    ];

    const visibleTasks = state.dataSource.filter((item) => state.statusFilter === "all" || item.stage === state.statusFilter);

    const openDetail = (item: TaskCard) => {
        const path = state.businessTab === "receipt" ? "/pages/task/receipt/index" : "/pages/task/pickup/index";
        pushHistory(path, {
            entrustId: item.entrustId || item.id,
            businessTab: state.businessTab,
            ...(item.taskId ? { taskId: item.taskId } : {}),
            ...(item.orderId ? { orderId: item.orderId } : {}),
        });
    };

    const reportException = (item: TaskCard) => {
        pushHistory("/pages/task/abnormal/index", {
            reportMode: "transportException",
            entrustId: item.entrustId || item.id,
            taskId: item.taskId,
            stage: state.businessTab === "pickupAndLoad" ? "PICKUP" : "SIGNOFF",
            ...(item.orderId ? { orderIds: JSON.stringify([item.orderId]) } : {}),
        });
    };

    return (
        <View className="ro-task-page">
            <View className="ro-task-header">
                <Text className="ro-task-title">任务列表</Text>
            </View>
            <View className="ro-task-business-tabs">
                {businessTabs.map((item) => (
                    <View
                        key={item.key}
                        className={`ro-task-business-tab ${state.businessTab === item.key ? "selected" : ""}`}
                        onClick={() => dispatch(actions.selectBusinessTab(item.key))}
                    >
                        {item.label}
                    </View>
                ))}
            </View>
            <ScrollView
                className="ro-task-scroll"
                scrollY
                style={{ height: pageHeight }}
                lowerThreshold={80}
                refresherEnabled
                onScrollToLower={() => dispatch(actions.loadMore())}
                onRefresherRefresh={() => dispatch(actions.refreshTasks())}
            >
                <View className="ro-task-summary-row">
                    {summaryItems.map((item) => (
                        <View className="ro-task-summary-card" key={item.key}>
                            <Text className="ro-task-summary-count" style={{ color: item.color }}>
                                {item.count}
                            </Text>
                            <Text className="ro-task-summary-label">{item.label}</Text>
                        </View>
                    ))}
                </View>
                <View className="ro-task-filter-row">
                    {(Object.keys(statusLabels[state.businessTab]) as StatusFilter[]).map((key) => (
                        <View
                            key={key}
                            className={`ro-task-filter ${state.statusFilter === key ? "selected" : ""}`}
                            onClick={() => dispatch(actions.selectStatusFilter(key))}
                        >
                            {statusLabels[state.businessTab][key]}
                        </View>
                    ))}
                </View>

                {state.errorMessage && (
                    <View className="ro-task-state" onClick={() => dispatch(actions.refreshTasks())}>
                        {state.errorMessage}，点击重试
                    </View>
                )}
                {!state.errorMessage && !visibleTasks.length && <View className="ro-task-state">暂无数据</View>}
                <View className="ro-task-list">
                    {visibleTasks.map((item) => (
                        <View className="ro-task-card" key={item.id} onClick={() => openDetail(item)}>
                            <View className="ro-task-card-header">
                                <Text className="ro-task-number">{item.taskNumber}</Text>
                                <Text
                                    className={`ro-task-status ${
                                        item.stage === "pendingSign"
                                            ? "status-pending-sign"
                                            : item.stage === "pendingPickup"
                                              ? "status-pending-pickup"
                                              : "status-picked"
                                    }`}
                                >
                                    {item.stageLabel}
                                </Text>
                            </View>
                            <View className="ro-task-line">
                                <Text>物流单号：</Text>
                                <Text>{item.logisticsNo}</Text>
                            </View>
                            <View className="ro-task-line">
                                <Text>{state.businessTab === "receipt" ? "送货车牌：" : "提货车牌："}</Text>
                                <Text>{item.plate}</Text>
                            </View>
                            <View className="ro-task-line">
                                <Text>{state.businessTab === "receipt" ? "送货司机：" : "提货司机："}</Text>
                                <Text>
                                    {item.driver} {item.driverPhone}
                                </Text>
                            </View>
                            <View className="ro-task-line">
                                <Text>{state.businessTab === "receipt" ? "计划送达时间：" : "计划提货时间："}</Text>
                                <Text>{item.pickupTime}</Text>
                            </View>
                            <View className="ro-task-quantity-row">
                                <View>
                                    <Text>总件数</Text>
                                    <Text className="value">{item.totalQuantity}</Text>
                                </View>
                                <View>
                                    <Text>{state.businessTab === "receipt" ? "已签收件数" : "已提件数"}</Text>
                                    <Text className="value done">{item.completedQuantity}</Text>
                                </View>
                                <View>
                                    <Text>{state.businessTab === "receipt" ? "待签收件数" : "待提件数"}</Text>
                                    <Text className="value pending">{item.pendingQuantity}</Text>
                                </View>
                            </View>
                            <View className="ro-task-cargo">
                                <Text className="label">货物信息</Text>
                                <Text>{item.cargoInfo}</Text>
                            </View>
                            <View className="ro-task-action-row">
                                <AtButton
                                    className="ro-task-action exception"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        reportException(item);
                                    }}
                                >
                                    <AtIcon value="warning" size={14} />
                                    运输异常上报
                                </AtButton>
                                <AtButton
                                    className="ro-task-action detail"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        openDetail(item);
                                    }}
                                >
                                    <AtIcon value="file" size={14} />
                                    {state.businessTab === "receipt" ? "查看签收明细" : "查看提货明细"}
                                </AtButton>
                            </View>
                        </View>
                    ))}
                </View>
                {state.dataSource.length > 0 && <View className="ro-task-loadmore">{state.hasMore ? "上拉加载更多" : "没有更多了"}</View>}
                <View className="ro-task-bottom-space" />
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (rootState: RootState) => ({
    state: rootState.app.task,
});

export default connect(mapStateToProps)(Task);
