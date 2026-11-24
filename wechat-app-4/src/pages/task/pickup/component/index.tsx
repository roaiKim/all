import { useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { AtButton, AtIcon } from "taro-ui";
import { TaskService$PickupPoint } from "@api/TaskService";
import { formatDateTime } from "@pages/task/shared";
import { Input, ScrollView, Text, View } from "@tarojs/components";
import { RootState } from "@type/state";
import { backHistory } from "@utils";
import { actions } from "../index";
import { State } from "../type";
import "./index.less";

interface Props {
    state: State;
}

interface PickupPointView extends TaskService$PickupPoint {
    taskId: string;
    statusLabel: string;
}

interface ConfirmForm {
    point: PickupPointView | null;
    deliveryCopies: string;
    containerNo: string;
    sealNo: string;
    tareWeight: string;
    cargoWeight: string;
    vgmWeight: string;
}

const emptyForm: ConfirmForm = {
    point: null,
    deliveryCopies: "1",
    containerNo: "",
    sealNo: "",
    tareWeight: "",
    cargoWeight: "",
    vgmWeight: "",
};

function PickupDetail({ state }: Props) {
    const dispatch = useDispatch();
    const [form, setForm] = useState<ConfirmForm>(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [showCargo, setShowCargo] = useState(false);
    const detail = state.detail;
    const tasks = detail?.tasks ?? [];
    const firstTask = tasks[0];
    const points = useMemo<PickupPointView[]>(
        () =>
            tasks.flatMap((task) =>
                task.pickupPoints.map((point) => ({
                    ...point,
                    taskId: task.taskId,
                    statusLabel: point.pickupConfirmed ? "已提货" : point.checkedIn ? "已签到" : point.state === "WAIT_PICKUP" ? "待提货" : "待签到",
                }))
            ),
        [tasks]
    );
    const allPicked = points.length > 0 && points.every((point) => point.pickupConfirmed);

    const openConfirm = (point: PickupPointView) => {
        if (!point.canConfirmPickup || point.pickupConfirmed) {
            return;
        }
        setForm({
            point,
            deliveryCopies: String(point.deliveryCopies || 1),
            containerNo: point.containerNo || "",
            sealNo: point.sealNo || "",
            tareWeight: point.tareWeight == null ? "" : String(point.tareWeight),
            cargoWeight: point.cargoWeight == null ? "" : String(point.cargoWeight),
            vgmWeight: point.vgmWeight == null ? "" : String(point.vgmWeight),
        });
        setShowForm(true);
    };

    const submitConfirm = () => {
        const point = form.point;
        const deliveryCopies = Number(form.deliveryCopies);
        if (!point || !Number.isInteger(deliveryCopies) || deliveryCopies < 1 || point.orderIds.length === 0) {
            return;
        }
        const toNumber = (value: string) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : undefined;
        };
        dispatch(
            actions.confirmPickup({
                taskId: point.taskId,
                pickupPointId: point.pickupPointId,
                orderIds: point.orderIds,
                expectedVersion: point.expectedVersion,
                deliveryCopies,
                containerMaterial: {
                    containerNo: form.containerNo.trim(),
                    sealNo: form.sealNo.trim(),
                    ...(toNumber(form.tareWeight) === undefined ? {} : { tareWeight: toNumber(form.tareWeight) }),
                    ...(toNumber(form.cargoWeight) === undefined ? {} : { cargoWeight: toNumber(form.cargoWeight) }),
                    ...(toNumber(form.vgmWeight) === undefined ? {} : { vgmWeight: toNumber(form.vgmWeight) }),
                },
            })
        );
        setShowForm(false);
    };

    const viewCargo = (point: PickupPointView) => {
        dispatch(actions.loadCargo({ taskId: point.taskId, pickupPointId: point.pickupPointId }));
        setShowCargo(true);
    };

    return (
        <View className="ro-task-detail-page">
            <View className="ro-task-detail-nav">
                <AtIcon value="chevron-left" onClick={() => backHistory()} />
                <Text>提货装车</Text>
                <View />
            </View>
            <ScrollView scrollY className="ro-task-detail-scroll">
                {state.errorMessage ? (
                    <View className="ro-task-detail-state" onClick={() => dispatch(actions.fetchDetail(state.entrustId, state.taskId))}>
                        {state.errorMessage}，点击重试
                    </View>
                ) : (
                    <>
                        <View className="ro-task-detail-card">
                            <View className="detail-head">
                                <Text className="detail-number">{detail?.entrustNo || "-"}</Text>
                                <Text className={`detail-status ${allPicked ? "done" : "pending"}`}>{allPicked ? "已提货" : "进行中"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>物流单号：</Text>
                                <Text>{firstTask?.logisticsNo || "-"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>提货车牌：</Text>
                                <Text>{firstTask?.truckNo || "-"}</Text>
                            </View>
                            <View className="detail-line">
                                <Text>提货司机：</Text>
                                <Text>
                                    {firstTask?.driverName || "-"} {firstTask?.driverPhone || ""}
                                </Text>
                            </View>
                        </View>
                        <Text className="section-title">提货点列表</Text>
                        {points.map((point, index) => (
                            <View className="ro-task-detail-card point-card" key={`${point.taskId}-${point.pickupPointId}`}>
                                <View className="point-head">
                                    <View className="point-index">{index + 1}</View>
                                    <Text className="point-name">{point.name}</Text>
                                    <Text className={`detail-status ${point.pickupConfirmed ? "done" : "pending"}`}>{point.statusLabel}</Text>
                                </View>
                                <View className="point-line">
                                    <AtIcon value="map-pin" size={15} color="#9aa5b5" />
                                    <Text>{point.address}</Text>
                                </View>
                                <Text className="point-contact">
                                    {point.contact} {point.phone}
                                </Text>
                                <View className="detail-line">
                                    <Text>计划提货时间：</Text>
                                    <Text>{formatDateTime(point.planTime)}</Text>
                                </View>
                                <View className="detail-line">
                                    <Text>提货数量：</Text>
                                    <Text>{point.totalPackageCount ?? "-"} 件</Text>
                                    <Text className="link" onClick={() => viewCargo(point)}>
                                        查看明细
                                    </Text>
                                </View>
                                <View className="point-actions">
                                    <AtButton
                                        size="small"
                                        className={point.checkedIn ? "action-success" : "action-primary"}
                                        disabled={!point.canCheckIn}
                                        onClick={() => dispatch(actions.signIn(point))}
                                    >
                                        {point.checkedIn ? "已签到" : "司机签到"}
                                    </AtButton>
                                    <AtButton
                                        size="small"
                                        className={point.pickupConfirmed ? "action-disabled" : "action-confirm"}
                                        disabled={!point.canConfirmPickup}
                                        onClick={() => openConfirm(point)}
                                    >
                                        {point.pickupConfirmed ? "已提货" : "确认提货"}
                                    </AtButton>
                                </View>
                            </View>
                        ))}
                        <View className="ro-task-detail-card">
                            <Text className="section-title inner">集装箱信息</Text>
                            <View className="container-grid">
                                <Text>集装箱号：{firstTask?.containerMaterial?.containerNo || "待填写"}</Text>
                                <Text>封条号：{firstTask?.containerMaterial?.sealNo || "待填写"}</Text>
                                <Text>货重：{firstTask?.containerMaterial?.cargoWeight ?? "待填写"}</Text>
                                <Text>VGM：{firstTask?.containerMaterial?.vgmWeight ?? "待填写"}</Text>
                            </View>
                        </View>
                        <View className="bottom-space" />
                    </>
                )}
            </ScrollView>
            {showForm && (
                <View className="modal-mask" onClick={() => setShowForm(false)}>
                    <View className="form-modal" onClick={(event) => event.stopPropagation()}>
                        <View className="modal-head">
                            <Text>确认提货</Text>
                            <Text onClick={() => setShowForm(false)}>×</Text>
                        </View>
                        {(["deliveryCopies", "containerNo", "sealNo", "tareWeight", "cargoWeight", "vgmWeight"] as Array<keyof ConfirmForm>).map(
                            (key) => (
                                <View className="form-row" key={key}>
                                    <Text>{key === "deliveryCopies" ? "送货单份数" : key}</Text>
                                    <Input
                                        value={String(form[key] || "")}
                                        type={key === "deliveryCopies" ? "number" : "text"}
                                        onInput={(event) => setForm((prev) => ({ ...prev, [key]: event.detail.value }))}
                                    />
                                </View>
                            )
                        )}
                        <AtButton type="primary" onClick={submitConfirm}>
                            确认提货
                        </AtButton>
                    </View>
                </View>
            )}
            {showCargo && (
                <View className="modal-mask" onClick={() => setShowCargo(false)}>
                    <View className="cargo-modal" onClick={(event) => event.stopPropagation()}>
                        <View className="modal-head">
                            <Text>货物明细</Text>
                            <Text onClick={() => setShowCargo(false)}>×</Text>
                        </View>
                        {state.cargo.length ? (
                            state.cargo.map((item) => (
                                <View className="cargo-row" key={item.packageId}>
                                    <Text>
                                        {item.materialCode} {item.materialName}
                                    </Text>
                                    <Text>
                                        {item.pcs ?? "-"} {item.unit}
                                    </Text>
                                    <Text>{item.boxNo || item.packingNo || item.palletNo || "-"}</Text>
                                </View>
                            ))
                        ) : (
                            <View className="ro-task-detail-state">暂无货物明细</View>
                        )}
                        <AtButton onClick={() => setShowCargo(false)}>关闭</AtButton>
                    </View>
                </View>
            )}
        </View>
    );
}

const mapStateToProps = (rootState: RootState) => ({ state: rootState.app.taskPickupDetail });

export default connect(mapStateToProps)(PickupDetail);
