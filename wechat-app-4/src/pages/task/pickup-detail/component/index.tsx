import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { AtIcon } from "taro-ui";
import { DriverExecutionAttachment, DriverExecutionPickupPoint } from "@api/DriverExecutionService";
import { actions } from "@pages/task/pickup-detail";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { pushHistory } from "@utils";
import { formatFileSize, getOrCreateRequestId, isChooseImageCancel, previewAttachment } from "@utils/functions";
import { Toast } from "@utils/ui/toast";
import {
    buildContainerMaterial,
    createPickupForm,
    getTaskStage,
    initialPickupForm,
    NumberFieldKey,
    parseNumberInput,
    validatePickup,
} from "./helper";
import PickupInfoModal from "./pickup-info-modal";
import PickupPointCard from "./pickup-point-card";
import { PickupForm } from "../type";
import "./index.less";

function PickupDetail(props: ReturnType<typeof mapStateToProps>) {
    const { entrustId, entrustNo, tasks, voucherFiles, actionLoading } = props;
    const dispatch = useDispatch();
    const requestIds = useRef<Record<string, string>>({});
    const [taskId, setTaskId] = useState("");
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [activePickupPointId, setActivePickupPointId] = useState("");
    const [form, setForm] = useState<PickupForm>(initialPickupForm);
    const [numberInputs, setNumberInputs] = useState<Record<NumberFieldKey, string>>({
        deliveryCopies: "",
        tareWeight: "",
        cargoWeight: "",
        vgmWeight: "",
    });
    const task = tasks.find((item) => item.taskId === taskId) || tasks[0];

    useEffect(() => {
        if (tasks.length > 0 && !tasks.some((item) => item.taskId === taskId)) {
            setTaskId(tasks[0].taskId);
        }
    }, [tasks, taskId]);

    useEffect(() => {
        if (entrustId && taskId) {
            dispatch(actions.fetchVoucherFiles(entrustId, taskId));
        }
    }, [entrustId, taskId, dispatch]);

    useEffect(() => {
        if (!showPickupModal) {
            return;
        }
        const activeTask = tasks.find((item) => item.taskId === taskId) || tasks[0];
        const point = activeTask?.pickupPoints?.find((item) => item.pickupPointId === activePickupPointId);
        if (point?.pickupConfirmed || point?.actualPickupTime) {
            setShowPickupModal(false);
        }
    }, [tasks, taskId, activePickupPointId, showPickupModal]);

    if (!task) {
        return (
            <View className="ro-pickup-page">
                <View className="empty-tip">暂无提货任务</View>
            </View>
        );
    }

    const points = task.pickupPoints || [];
    const material = task.containerMaterial || {};
    const stage = getTaskStage(task);
    const voucherReadOnly = !!task.allPickupCompleted || task.displayStage === "PICKED_UP";
    const hasContainerValue =
        !!material.containerNo ||
        !!material.sealNo ||
        material.tareWeight !== undefined ||
        material.cargoWeight !== undefined ||
        material.vgmWeight !== undefined;
    const showContainerForm = !!task.materialApplicable || hasContainerValue;

    const updateForm = (patch: Partial<PickupForm>) => {
        setForm((prev) => ({ ...prev, ...patch }));
    };

    const handleSelectTask = (nextTaskId: string) => {
        if (actionLoading || nextTaskId === task.taskId) {
            return;
        }
        setTaskId(nextTaskId);
    };

    const handleCheckIn = async (point: DriverExecutionPickupPoint) => {
        const result = await Taro.showModal({ title: "司机签到", content: `确认已到达【${point.name}】并签到？` });
        if (!result.confirm) {
            return;
        }
        const payload = {
            entrustId,
            taskId: task.taskId,
            pickupPointId: point.pickupPointId,
            expectedVersion: task.expectedVersion,
        };
        dispatch(actions.checkIn({ ...payload, requestId: getOrCreateRequestId(requestIds.current, "pickup_checkin", payload) }));
    };

    const handleOpenPickupModal = (point: DriverExecutionPickupPoint) => {
        const nextForm = createPickupForm(task, point);
        setNumberInputs({
            deliveryCopies: `${nextForm.deliveryCopies ?? ""}`,
            tareWeight: `${nextForm.tareWeight ?? ""}`,
            cargoWeight: `${nextForm.cargoWeight ?? ""}`,
            vgmWeight: `${nextForm.vgmWeight ?? ""}`,
        });
        setActivePickupPointId(point.pickupPointId);
        setForm(nextForm);
        setShowPickupModal(true);
    };

    const handleNumberInput = (key: NumberFieldKey, value: string) => {
        setNumberInputs((prev) => ({ ...prev, [key]: value }));
        updateForm({ [key]: parseNumberInput(value) });
    };

    const handleConfirmPickup = () => {
        const message = validatePickup(task, form, voucherFiles);
        if (message) {
            Toast.text(message);
            return;
        }
        const payload = {
            entrustId,
            taskId: task.taskId,
            pickupPointId: activePickupPointId,
            expectedVersion: task.expectedVersion,
            deliveryCopies: form.deliveryCopies,
            containerMaterial: buildContainerMaterial(form),
            attachmentIds: voucherFiles.map((file) => file.attachmentId),
        };
        dispatch(actions.confirmPickup({ ...payload, requestId: getOrCreateRequestId(requestIds.current, "pickup_confirm", payload) }));
    };

    const handleUploadVoucher = async () => {
        if (actionLoading) {
            return;
        }
        const remain = 20 - voucherFiles.length;
        if (remain <= 0) {
            Toast.text("提货凭证最多上传20份");
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
            dispatch(actions.uploadVouchers({ entrustId, taskId: task.taskId, filePaths: media.tempFilePaths }));
        }
    };

    const handleDeleteVoucher = async (file: DriverExecutionAttachment) => {
        const result = await Taro.showModal({ title: "删除凭证", content: `确定删除【${file.fileName || "该文件"}】吗？` });
        if (result.confirm) {
            dispatch(actions.deleteVoucher(file));
        }
    };

    const handleOpenCargo = (point: DriverExecutionPickupPoint) => {
        pushHistory("/pages/task/cargo-detail/index", {
            entrustId,
            taskId: task.taskId,
            pickupPointId: point.pickupPointId,
            mode: "pickup",
        });
    };

    return (
        <View className="ro-pickup-page">
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
                    <Text className={`status-tag status-${stage.type}`}>{stage.text}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">物流单号：</Text>
                    <Text className="info-value">{task.logisticsNo || "-"}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">提货车牌：</Text>
                    <Text className="info-value">{task.truckNo || "-"}</Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">提货司机：</Text>
                    <Text className="info-value">
                        {task.driverName || "-"} {task.driverPhone || ""}
                    </Text>
                </View>
                <View className="info-line">
                    <Text className="info-label">送货单份数：</Text>
                    <Text className="info-value">{task.deliveryCopies ?? "-"} 份</Text>
                </View>
                {task.blockedReason && <View className="blocked-tip">{task.blockedReason}</View>}
            </View>

            <View className="section-title">提货点列表</View>

            {points.map((point, index) => (
                <PickupPointCard
                    key={point.pickupPointId}
                    point={point}
                    index={index}
                    plannedArrivalTime={task.plannedArrivalTime}
                    onCheckIn={() => handleCheckIn(point)}
                    onOpenConfirm={() => handleOpenPickupModal(point)}
                    onOpenCargo={() => handleOpenCargo(point)}
                />
            ))}

            <View className="section-title">提货凭证</View>
            <View className="voucher-card">
                {voucherReadOnly ? (
                    <View className="voucher-readonly">提货已完成，凭证仅支持查看</View>
                ) : (
                    <View className="upload-area" onClick={handleUploadVoucher}>
                        <AtIcon value="camera" size={34} />
                        <View className="upload-title">点击上传提货凭证</View>
                        <View className="upload-desc">支持拍照或从相册选择（图片）</View>
                        {task.voucherRequired && <View className="upload-hint">末点提货需上传凭证</View>}
                    </View>
                )}
                {voucherFiles.length === 0 ? (
                    <View className="voucher-empty">暂无凭证</View>
                ) : (
                    voucherFiles.map((file) => (
                        <View className="file-row" key={file.attachmentId}>
                            <AtIcon value="file-jpg" size={18} />
                            <Text className="file-name">{file.fileName || "提货凭证"}</Text>
                            <Text className="file-size">{formatFileSize(file.fileSize)}</Text>
                            <Text className="file-action" onClick={() => previewAttachment(file)}>
                                查看
                            </Text>
                            {!voucherReadOnly && file.canDelete !== false && (
                                <Text className="file-action danger" onClick={() => handleDeleteVoucher(file)}>
                                    删除
                                </Text>
                            )}
                        </View>
                    ))
                )}
            </View>

            <View className="section-title">集装箱信息</View>
            <View className="task-card">
                <View className="container-grid">
                    <View className="container-item">
                        <View className="container-label">集装箱号</View>
                        <View className="container-value">{material.containerNo || "待填写"}</View>
                    </View>
                    <View className="container-item">
                        <View className="container-label">封条号</View>
                        <View className="container-value">{material.sealNo || "待填写"}</View>
                    </View>
                    <View className="container-item">
                        <View className="container-label">空柜重(kg)</View>
                        <View className="container-value">{material.tareWeight ?? "待填写"}</View>
                    </View>
                    <View className="container-item">
                        <View className="container-label">货重(kg)</View>
                        <View className="container-value">{material.cargoWeight ?? "待填写"}</View>
                    </View>
                    <View className="container-item full">
                        <View className="container-label">VGM重(kg)</View>
                        <View className="container-value">{material.vgmWeight ?? "待填写"}</View>
                    </View>
                </View>
                {task.materialRequired && <View className="container-hint">本场景需在确认提货时填写集装箱信息</View>}
            </View>

            <PickupInfoModal
                visible={showPickupModal}
                form={form}
                numberInputs={numberInputs}
                showContainerForm={showContainerForm}
                actionLoading={actionLoading}
                onClose={() => setShowPickupModal(false)}
                onConfirm={handleConfirmPickup}
                onNumberInput={handleNumberInput}
                onTextChange={updateForm}
            />
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        entrustId: state.app.pickupDetail.entrustId,
        entrustNo: state.app.pickupDetail.entrustNo,
        tasks: state.app.pickupDetail.tasks,
        voucherFiles: state.app.pickupDetail.voucherFiles,
        actionLoading: showLoading(state, "pickupAction"),
    };
};

export default connect(mapStateToProps)(PickupDetail);
