import { DriverExecutionReceiptRecord } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { formatSignTime, getStatusTag } from "./helper";

interface RecordCardProps {
    record: DriverExecutionReceiptRecord;
    onOpen: () => void;
}

function RecordCard(props: RecordCardProps) {
    const { record, onOpen } = props;
    const tag = getStatusTag(record);

    return (
        <View className="record-card" onClick={onOpen}>
            <View className="record-head">
                <Text className="record-no">{record.podNo || record.podId}</Text>
                <Text className={`status-tag status-${tag.type}`}>{tag.text}</Text>
            </View>
            <View className="record-line">
                <Text className="label">运输订单：</Text>
                <Text>{record.orderNo || "-"}</Text>
            </View>
            <View className="record-line">
                <Text className="label">签收时间：</Text>
                <Text>{formatSignTime(record.signTime || record.recordedAt)}</Text>
            </View>
            <View className="record-line">
                <Text className="label">签收人：</Text>
                <Text>{record.signer || "-"}</Text>
            </View>
            <View className="record-count">
                <Text>处理 {record.processedPackageCount ?? 0} 件</Text>
                <Text>实收 {record.actualPackageCount ?? 0} 件</Text>
                <Text>附件 {(record.attachments || []).length} 份</Text>
            </View>
            {record.remark && <View className="record-remark">备注：{record.remark}</View>}
        </View>
    );
}

export default RecordCard;
