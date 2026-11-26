import dayjs from "dayjs";
import { AtIcon } from "taro-ui";
import { DriverExecutionEntrustCard, DriverExecutionTab, DriverExecutionTaskItem } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { countOf, formatMetric, getStageInfo, sumMetric } from "./helper";

interface TaskCardProps {
    record: DriverExecutionEntrustCard;
    tab: DriverExecutionTab;
    onOpen: () => void;
    onException: () => void;
    onCargo: () => void;
    onRecords: () => void;
}

function TaskCard(props: TaskCardProps) {
    const { record, tab, onOpen, onException, onCargo, onRecords } = props;
    const tasks = record.tasks || [];
    const firstTask = tasks[0] || ({} as DriverExecutionTaskItem);
    const stage = getStageInfo(record, tab);
    const total = countOf(tasks, "totalPackageCount");
    const doneCount = countOf(tasks, tab === "PICKUP" ? "completedPackageCount" : "signedPackageCount");
    const pendingMetric = sumMetric(tasks, "pendingPackageCount");
    const pending = pendingMetric === null ? Math.max(total - doneCount, 0) : pendingMetric;
    const weight = sumMetric(tasks, "actualGrossWeight");
    const volume = sumMetric(tasks, "actualVolume");
    const driver = [firstTask.driverName, firstTask.driverPhone].filter(Boolean).join(" ") || "-";
    const isPickup = tab === "PICKUP";
    const planTime = firstTask.planTime || firstTask.plannedArrivalTime || record.planTime;

    return (
        <View className="task-card" onClick={onOpen}>
            <View className="task-head">
                <Text className="task-no">{record.entrustNo || firstTask.taskNo}</Text>
                <Text className={`status-tag status-${stage.type}`}>{stage.text}</Text>
            </View>
            <View className="info-line">
                <Text className="info-label">物流单号：</Text>
                <Text className="info-value">{firstTask.logisticsNo || "-"}</Text>
            </View>
            <View className="info-line">
                <Text className="info-label">{isPickup ? "提货车牌：" : "送货车牌："}</Text>
                <Text className="info-value">{firstTask.truckNo || "-"}</Text>
            </View>
            <View className="info-line">
                <Text className="info-label">{isPickup ? "提货司机：" : "送货司机："}</Text>
                <Text className="info-value">{driver}</Text>
            </View>
            <View className="info-line">
                <Text className="info-label">{isPickup ? "计划提货时间：" : "计划送达时间："}</Text>
                <Text className="info-value">{planTime ? dayjs(planTime).format("YYYY-MM-DD HH:mm") : "-"}</Text>
            </View>

            <View className="count-row">
                <View className="count-item">
                    <View className="count-label">总件数</View>
                    <View className="count-value">{total}</View>
                </View>
                <View className="count-item">
                    <View className="count-label">{isPickup ? "已提件数" : "已签件数"}</View>
                    <View className="count-value count-green">{doneCount}</View>
                </View>
                <View className="count-item">
                    <View className="count-label">{isPickup ? "待提件数" : "待签件数"}</View>
                    <View className="count-value count-orange">{pending}</View>
                </View>
            </View>

            <View className="cargo-info">
                <View className="cargo-label">货物信息</View>
                <View className="cargo-value">
                    {total}件 / {formatMetric(weight)}kg / {formatMetric(volume)}CBM
                </View>
            </View>

            <View className="action-row">
                <View
                    className="action-btn action-orange"
                    onClick={(event) => {
                        event.stopPropagation();
                        onException();
                    }}
                >
                    <AtIcon value="alert-circle" size={14} />
                    <Text>运输异常上报</Text>
                </View>
                <View
                    className="action-btn action-blue"
                    onClick={(event) => {
                        event.stopPropagation();
                        onCargo();
                    }}
                >
                    <AtIcon value="file-generic" size={14} />
                    <Text>{isPickup ? "查看提货明细" : "查看送货明细"}</Text>
                </View>
                {!isPickup && (
                    <View
                        className="action-btn action-green"
                        onClick={(event) => {
                            event.stopPropagation();
                            onRecords();
                        }}
                    >
                        <AtIcon value="list" size={14} />
                        <Text>查看签收记录</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default TaskCard;
