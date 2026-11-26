import { AtIcon, AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import { DriverExecutionService$receiptRecordDetail$Response } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { formatFileSize, previewAttachment } from "@utils/functions";
import { formatSignTime } from "./helper";

interface RecordDetailModalProps {
    visible: boolean;
    detail: DriverExecutionService$receiptRecordDetail$Response | null;
    onClose: () => void;
}

function RecordDetailModal(props: RecordDetailModalProps) {
    const { visible, detail, onClose } = props;

    return (
        <AtModal className="ro-records-modal" isOpened={visible} closeOnClickOverlay={false} onClose={onClose}>
            <AtModalHeader>签收记录详情</AtModalHeader>
            <AtModalContent>
                {detail ? (
                    <View className="detail-content">
                        <View className="detail-line">
                            <Text className="label">签收单号：</Text>
                            <Text>{detail.podNo || detail.podId}</Text>
                        </View>
                        <View className="detail-line">
                            <Text className="label">运输订单：</Text>
                            <Text>{detail.orderNo || "-"}</Text>
                        </View>
                        <View className="detail-line">
                            <Text className="label">签收时间：</Text>
                            <Text>{formatSignTime(detail.signTime || detail.recordedAt)}</Text>
                        </View>
                        <View className="detail-line">
                            <Text className="label">签收人：</Text>
                            <Text>{detail.signer || "-"}</Text>
                        </View>
                        <View className="detail-line">
                            <Text className="label">处理件数：</Text>
                            <Text>{detail.processedPackageCount ?? 0} 件</Text>
                        </View>
                        <View className="detail-line">
                            <Text className="label">实收件数：</Text>
                            <Text>{detail.actualPackageCount ?? 0} 件</Text>
                        </View>
                        {detail.remark && (
                            <View className="detail-line">
                                <Text className="label">备注：</Text>
                                <Text>{detail.remark}</Text>
                            </View>
                        )}

                        <View className="detail-title">签收明细</View>
                        {(detail.details || []).length === 0 ? (
                            <View className="detail-empty">暂无明细</View>
                        ) : (
                            <View className="detail-table">
                                <View className="detail-table-head">
                                    <Text className="col-box">箱号</Text>
                                    <Text className="col-item">物料</Text>
                                    <Text className="col-pcs">应签/实收</Text>
                                </View>
                                {(detail.details || []).map((line, index) => (
                                    <View className="detail-table-row" key={line.detailId || `${line.itemCode || "detail"}_${index}`}>
                                        <Text className="col-box">{line.boxNo || "-"}</Text>
                                        <Text className="col-item">{line.itemCode || "-"}</Text>
                                        <Text className="col-pcs">
                                            {line.expectedPcs ?? "-"} / {line.actualPcs ?? "-"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View className="detail-title">附件</View>
                        {(detail.attachments || []).length === 0 ? (
                            <View className="detail-empty">暂无附件</View>
                        ) : (
                            <View className="attach-list">
                                {(detail.attachments || []).map((file) => (
                                    <View className="attach-file" key={file.attachmentId}>
                                        <AtIcon value="file-jpg" size={16} />
                                        <Text className="attach-name">{file.fileName || "签收附件"}</Text>
                                        <Text className="attach-size">{formatFileSize(file.fileSize)}</Text>
                                        <Text className="attach-action" onClick={() => previewAttachment(file)}>
                                            查看
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="detail-empty">加载中...</View>
                )}
            </AtModalContent>
            <AtModalAction>
                <View className="modal-confirm" onClick={onClose}>
                    关闭
                </View>
            </AtModalAction>
        </AtModal>
    );
}

export default RecordDetailModal;
