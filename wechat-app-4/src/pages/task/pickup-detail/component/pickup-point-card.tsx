import dayjs from "dayjs";
import { AtIcon } from "taro-ui";
import { DriverExecutionPickupPoint } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { getPointStage } from "./helper";

interface PickupPointCardProps {
    point: DriverExecutionPickupPoint;
    index: number;
    plannedArrivalTime?: string;
    onCheckIn: () => void;
    onOpenConfirm: () => void;
    onOpenCargo: () => void;
}

function PickupPointCard(props: PickupPointCardProps) {
    const { point, index, plannedArrivalTime, onCheckIn, onOpenConfirm, onOpenCargo } = props;
    const pointStage = getPointStage(point);
    const pointDone = pointStage.type === "done";
    const planTime = point.planTime || plannedArrivalTime;

    return (
        <View className={`point-card ${pointDone ? "point-done" : ""}`}>
            <View className="point-head">
                <View className={`point-index ${pointDone ? "done" : "pending"}`}>{index + 1}</View>
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
                <Text className="label">计划提货时间：</Text>
                <Text>{planTime ? dayjs(planTime).format("YYYY-MM-DD HH:mm") : "-"}</Text>
            </View>
            <View className="point-line point-count-line">
                <Text className="label">提货数量：</Text>
                <Text className="point-count">{point.totalPackageCount ?? point.actualMaxPackageCount ?? 0}</Text>
                <Text className="point-unit">件</Text>
                <Text className="view-detail-link" onClick={onOpenCargo}>
                    查看提货明细
                </Text>
            </View>
            {point.transportRequirements && (
                <View className="requirement">
                    <Text className="requirement-label">运输要求：</Text>
                    <Text>{point.transportRequirements}</Text>
                </View>
            )}
            <View className="point-actions">
                {point.canCheckIn ? (
                    <View className="point-btn primary" onClick={onCheckIn}>
                        司机签到
                    </View>
                ) : (
                    <View className={`point-btn ${point.checkedIn || point.checkedInAt ? "done" : "disabled"}`}>
                        {point.checkedIn || point.checkedInAt ? "已签到" : "未签到"}
                    </View>
                )}
                {point.canConfirmPickup ? (
                    <View className="point-btn primary" onClick={onOpenConfirm}>
                        确认提货
                    </View>
                ) : point.pickupConfirmed ? (
                    <View className="point-btn done">已提货</View>
                ) : (
                    <View className="point-btn disabled">请先签到</View>
                )}
            </View>
        </View>
    );
}

export default PickupPointCard;
