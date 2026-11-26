import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import dayjs from "dayjs";
import { AtIcon } from "taro-ui";
import { DriverExecutionReceiptOrder, DriverExecutionReceiptTask } from "@api/DriverExecutionService";
import { actions } from "@pages/task/receipt-detail";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { getOrCreateRequestId, isChooseImageCancel } from "@utils/functions";
import { Toast } from "@utils/ui/toast";
import { buildReceiptRequest, getPointStage, normalizeReasonOptions, normalizeSignOptions, ReceiptRequestPayload } from "./helper";
import OrderCard from "./order-card";
import ReceiptDetailModal from "./receipt-detail-modal";
import { OrderDraft } from "../type";
import "./index.less";

function ReceiptDetail(props: ReturnType<typeof mapStateToProps>) {
    const { entrustId, entrustNo, tasks, receiptFiles, signStatusOptions, abnormalReasonOptions, receivableGroups, validation, actionLoading } =
        props;
    const dispatch = useDispatch();
    const requestIds = useRef<Record<string, string>>({});
    const pendingRequest = useRef<ReceiptRequestPayload | null>(null);
    const [taskId, setTaskId] = useState("");
    const [drafts, setDrafts] = useState<Record<string, OrderDraft>>({});
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState("");
    const [editingCount, setEditingCount] = useState(0);
    const task: DriverExecutionReceiptTask = tasks.find((item) => item.taskId === taskId) || tasks[0];
    const signOptions = normalizeSignOptions(signStatusOptions);
    const reasonOptions = normalizeReasonOptions(abnormalReasonOptions);
    const selectedCount = Math.min(editingCount, receivableGroups.length);

    useEffect(() => {
        if (tasks.length > 0 && !tasks.some((item) => item.taskId === taskId)) {
            setTaskId(tasks[0].taskId);
        }
    }, [tasks, taskId]);

    useEffect(() => {
        if (entrustId && taskId) {
            dispatch(actions.fetchReceiptFiles(entrustId, taskId));
        }
    }, [entrustId, taskId, dispatch]);

    useEffect(() => {
        const activeTask = tasks.find((item) => item.taskId === taskId) || tasks[0];
        const nextDrafts: Record<string, OrderDraft> = {};
        (activeTask?.unloadPoints || []).forEach((point) => {
            (point.orders || []).forEach((order) => {
                const groups = order.packageGroups || [];
                const count = Math.min(order.pendingPackageCount || 0, groups.length);
                nextDrafts[order.orderId] = {
                    signStatus: 10,
                    packageGroupIds: groups.slice(0, count).map((group) => group.packageGroupId),
                    selectedCount: count,
                    remark: "",
                    reasonCode: "",
                };
            });
        });
        setDrafts(nextDrafts);
    }, [tasks, taskId]);

    useEffect(() => {
        if (!validation) {
            return;
        }
        if (!validation.valid) {
            Toast.text(validation.msg || "签收校验未通过，请检查明细");
            dispatch(actions.clearValidation());
            return;
        }
        if (!pendingRequest.current) {
            dispatch(actions.clearValidation());
            return;
        }

        const nextPayload = { ...pendingRequest.current, expectedVersion: validation.version || pendingRequest.current.expectedVersion };
        Taro.showModal({
            title: "确认签收",
            content: `本次处理 ${validation.processedPackageCount ?? 0} 件，实收 ${validation.actualPackageCount ?? 0} 件，确认签收？`,
            confirmText: "确认签收",
        }).then((result) => {
            if (result.confirm) {
                dispatch(
                    actions.confirmReceipt({
                        ...nextPayload,
                        requestId: getOrCreateRequestId(requestIds.current, "receipt_confirm", nextPayload),
                    })
                );
                return;
            }
            dispatch(actions.clearValidation());
        });
    }, [validation, dispatch]);

    if (!task) {
        return (
            <View className="ro-receipt-page">
                <View className="empty-tip">暂无签收任务</View>
            </View>
        );
    }

    const points = task.unloadPoints || [];
    const driver = [task.driverName, task.driverPhone].filter(Boolean).join(" ") || "-";
    const plannedArrivalTime = task.plannedArrivalTime ? dayjs(task.plannedArrivalTime).format("YYYY-MM-DD HH:mm") : "-";

    const updateDraft = (orderId: string, patch: Partial<OrderDraft>) => {
        setDrafts((prev) => ({ ...prev, [orderId]: { ...prev[orderId], ...patch } }));
    };

    const handleSelectTask = (nextTaskId: string) => {
        if (actionLoading || nextTaskId === task.taskId) {
            return;
        }
        setTaskId(nextTaskId);
    };

    const handleOpenDetailModal = (order: DriverExecutionReceiptOrder) => {
        const draft = drafts[order.orderId];
        setEditingOrderId(order.orderId);
        setEditingCount(draft?.selectedCount || 0);
        setDetailModalVisible(true);
        dispatch(actions.fetchReceivableCargo(order.orderId, order.packageGroups || []));
    };

    const handleEditingCount = (value: string) => {
        setEditingCount(Math.min(Number(value.replace(/[^\d]/g, "") || 0), receivableGroups.length));
    };

    const handleGroupClick = (index: number) => {
        setEditingCount(index + 1);
    };

    const handleSaveDetail = () => {
        updateDraft(editingOrderId, {
            selectedCount,
            packageGroupIds: receivableGroups.slice(0, selectedCount).map((group) => group.packageGroupId),
        });
        setDetailModalVisible(false);
    };

    const handleUpload = async (order: DriverExecutionReceiptOrder) => {
        const remain = 20 - (receiptFiles[order.orderId]?.length || 0);
        if (remain <= 0) {
            Toast.text("签收凭证最多上传20份");
            return;
        }

        let media;
        try {
            media = await Taro.chooseImage({
                count: Math.min(9, remain),
                sizeType: ["compressed"],
                sourceType: ["camera", "album"],
            });
        } catch (error) {
            if (!isChooseImageCancel(error)) {
                Toast.text("图片选择失败");
            }
            return;
        }

        if (media.tempFilePaths.length > 0) {
            dispatch(actions.uploadReceiptFiles(entrustId, task.taskId, order.orderId, media.tempFilePaths));
        }
    };

    const handleConfirmPoint = (point: DriverExecutionReceiptTask["unloadPoints"][number]) => {
        const { error, payload } = buildReceiptRequest(entrustId, task, point, drafts, receiptFiles);
        if (error || !payload) {
            Toast.text(error);
            return;
        }
        pendingRequest.current = payload;
        dispatch(
            actions.validateReceipt({
                ...payload,
                requestId: getOrCreateRequestId(requestIds.current, "receipt_validate", payload),
            })
        );
    };

    return (
        <View className="ro-receipt-page">
            {tasks.length > 1 && (
                <View className="task-switch">
                    {tasks.map((item, index) => (
                        <View
                            className={`task-switch-item ${item.taskId === task.taskId ? "active" : ""}`}
                            key={item.taskId}
                            onClick={() => handleSelectTask(item.taskId)}
                        >
                            任务{index + 1}：{item.taskNo}
                        </View>
                    ))}
                </View>
            )}

            <View className="task-card">
                <View className="task-head">
                    <Text className="task-no">{entrustNo || task.taskNo}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">物流单号：</Text>
                    <Text className="info-value">{task.logisticsNo || "-"}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">送货车牌：</Text>
                    <Text className="info-value">{task.truckNo || "-"}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">送货司机：</Text>
                    <Text className="info-value">{driver}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">计划送达时间：</Text>
                    <Text className="info-value">{plannedArrivalTime}</Text>
                </View>
            </View>

            <View className="section-title">卸货点列表</View>

            {points.map((point, pointIndex) => {
                const orders = point.orders || [];
                const pointStage = getPointStage(orders);
                const pendingOrders = orders.filter((order) => (order.pendingPackageCount || 0) > 0);
                const signableOrders = pendingOrders.filter((order) => order.canSign !== false);
                return (
                    <View className="point-card" key={point.unloadPointId}>
                        <View className="point-head">
                            <View className={`point-index ${pointStage.type === "done" ? "done" : "pending"}`}>{pointIndex + 1}</View>
                            <Text className="point-name">{point.name}</Text>
                            <Text className={`status-tag status-${pointStage.type}`}>{pointStage.text}</Text>
                        </View>
                        <View className="point-address">
                            <AtIcon value="map-pin" size={13} />
                            <Text>{point.address || "-"}</Text>
                        </View>
                        <View className="point-contact">
                            {point.contact || "-"} {point.phone || ""}
                        </View>
                        <View className="point-line">
                            <Text className="label">计划送达时间：</Text>
                            <Text>{plannedArrivalTime}</Text>
                        </View>

                        {orders.map((order) => {
                            const draft = drafts[order.orderId];
                            if (!draft) {
                                return null;
                            }
                            return (
                                <OrderCard
                                    key={order.orderId}
                                    order={order}
                                    draft={draft}
                                    signOptions={signOptions}
                                    reasonOptions={reasonOptions}
                                    files={receiptFiles[order.orderId] || []}
                                    onDraftChange={(patch) => updateDraft(order.orderId, patch)}
                                    onOpenDetail={() => handleOpenDetailModal(order)}
                                    onUpload={() => handleUpload(order)}
                                    onRemoveAttachment={(file) => dispatch(actions.removeReceiptFile(order.orderId, file))}
                                />
                            );
                        })}

                        {signableOrders.length > 0 ? (
                            <View
                                className={`point-confirm ${actionLoading ? "disabled" : ""}`}
                                onClick={() => !actionLoading && handleConfirmPoint(point)}
                            >
                                {actionLoading ? "提交中..." : "确认签收"}
                            </View>
                        ) : pendingOrders.length > 0 ? (
                            <View className="point-confirm disabled">存在不可签收订单</View>
                        ) : null}
                    </View>
                );
            })}

            <ReceiptDetailModal
                visible={detailModalVisible}
                groups={receivableGroups}
                selectedCount={selectedCount}
                onClose={() => setDetailModalVisible(false)}
                onSave={handleSaveDetail}
                onCountChange={handleEditingCount}
                onGroupClick={handleGroupClick}
            />
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        entrustId: state.app.receiptDetail.entrustId,
        entrustNo: state.app.receiptDetail.entrustNo,
        tasks: state.app.receiptDetail.tasks,
        receiptFiles: state.app.receiptDetail.receiptFiles,
        signStatusOptions: state.app.receiptDetail.signStatusOptions,
        abnormalReasonOptions: state.app.receiptDetail.abnormalReasonOptions,
        receivableGroups: state.app.receiptDetail.receivableGroups,
        validation: state.app.receiptDetail.validation,
        actionLoading: showLoading(state, "receiptSubmit"),
    };
};

export default connect(mapStateToProps)(ReceiptDetail);
