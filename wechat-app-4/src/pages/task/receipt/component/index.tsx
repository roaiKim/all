import { useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { AtButton, AtIcon } from "taro-ui";
import { TaskService$ReceiptOrder, TaskService$UnloadPoint } from "@api/TaskService";
import { formatDateTime } from "@pages/task/shared";
import { ScrollView, Text, View } from "@tarojs/components";
import { RootState } from "@type/state";
import { backHistory } from "@utils";
import { actions } from "../index";
import { State } from "../type";
import "./index.less";

interface Props {
    state: State;
}

interface UnloadPointView extends TaskService$UnloadPoint {
    taskId: string;
    version: string;
    plannedArrivalTime: string | null;
}

function ReceiptDetail({ state }: Props) {
    const dispatch = useDispatch();
    const detail = state.detail;
    const tasks = detail?.tasks ?? [];
    const firstTask = tasks[0];
    const points = useMemo<UnloadPointView[]>(
        () =>
            tasks.flatMap((task) =>
                task.unloadPoints.map((point) => ({
                    ...point,
                    taskId: task.taskId,
                    version: task.version,
                    plannedArrivalTime: task.plannedArrivalTime,
                }))
            ),
        [tasks]
    );
    const allReceived =
        points.length > 0 && points.every((point) => point.orders.every((order) => order.signStatus === 10 || order.signStatus === 20));

    const confirmOrder = (point: UnloadPointView, order: TaskService$ReceiptOrder) => {
        if (!order.canSign || order.packageGroups.length === 0) {
            return;
        }
        dispatch(
            actions.confirmReceipt({
                taskId: point.taskId,
                unloadPointId: point.unloadPointId,
                expectedVersion: point.version,
                orders: [
                    {
                        orderId: order.orderId,
                        signStatus: 10,
                        packageGroupIds: order.packageGroups.map((group) => group.packageGroupId),
                        reasonCode: null,
                        remark: null,
                    },
                ],
            })
        );
    };

    return (
        <View className="ro-task-detail-page">
            <View className="ro-task-detail-nav">
                <AtIcon value="chevron-left" onClick={() => backHistory()} />
                <Text>货物签收</Text>
                <View />
            </View>
            <ScrollView scrollY className="ro-task-detail-scroll">
                {state.errorMessage ? (
                    <View
                        className="ro-task-detail-state"
                        onClick={() => dispatch(actions.fetchDetail(state.entrustId, state.taskId, state.orderId))}
                    >
                        {state.errorMessage}，点击重试
                    </View>
                ) : (
                    <>
                        <View className="ro-task-detail-card">
                            <View className="detail-head">
                                <Text className="detail-number">{detail?.entrustNo || "-"}</Text>
                                <Text className={`detail-status ${allReceived ? "done" : "pending"}`}>{allReceived ? "已签收" : "进行中"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>物流单号：</Text>
                                <Text>{firstTask?.logisticsNo || "-"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>送货车牌：</Text>
                                <Text>{firstTask?.truckNo || "-"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>计划送达时间：</Text>
                                <Text>{formatDateTime(firstTask?.plannedArrivalTime)}</Text>
                            </View>
                        </View>
                        <Text className="section-title">签收点列表</Text>
                        {points.map((point, index) => (
                            <View className="ro-task-detail-card point-card" key={`${point.taskId}-${point.unloadPointId}`}>
                                <View className="point-head">
                                    <View className="point-index">{index + 1}</View>
                                    <Text className="point-name">{point.name}</Text>
                                    <Text className="detail-status pending">{formatDateTime(point.plannedArrivalTime)}</Text>
                                </View>
                                <View className="point-line">
                                    <AtIcon value="map-pin" size={15} color="#9aa5b5" />
                                    <Text>{point.address}</Text>
                                </View>
                                <Text className="point-contact">
                                    {point.contact} {point.phone}
                                </Text>
                                {point.orders.map((order) => {
                                    const received = order.signStatus === 10 || order.signStatus === 20;
                                    return (
                                        <View className="order-card" key={order.orderId}>
                                            <Text className="order-number">{order.orderNo}</Text>
                                            <Text className="order-summary">客户：{order.customerName || "-"}</Text>
                                            <View className="order-metrics">
                                                <Text>总件数 {order.totalPackageCount ?? "-"}</Text>
                                                <Text>已签收 {order.signedPackageCount ?? 0}</Text>
                                                <Text>待签收 {order.pendingPackageCount ?? "-"}</Text>
                                            </View>
                                            <AtButton
                                                size="small"
                                                disabled={received || !order.canSign}
                                                className={received ? "action-success" : "action-confirm"}
                                                onClick={() => confirmOrder(point, order)}
                                            >
                                                {received ? "已签收" : order.blockedReason || "确认签收"}
                                            </AtButton>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                        <View className="bottom-space" />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (rootState: RootState) => ({ state: rootState.app.taskReceiptDetail });

export default connect(mapStateToProps)(ReceiptDetail);
