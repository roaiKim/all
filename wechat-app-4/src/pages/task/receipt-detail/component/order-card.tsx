import { AtIcon } from "taro-ui";
import { DriverExecutionAttachment, DriverExecutionReceiptOrder } from "@api/DriverExecutionService";
import { Picker, Text, Textarea, View } from "@tarojs/components";
import { previewAttachment } from "@utils/functions";
import AttachmentList from "./attachment-list";
import { getOrderStage } from "./helper";
import { DEFAULT_REASON_OPTIONS, DEFAULT_SIGN_OPTIONS, OrderDraft } from "../type";

interface OrderCardProps {
    order: DriverExecutionReceiptOrder;
    draft: OrderDraft;
    signOptions: typeof DEFAULT_SIGN_OPTIONS;
    reasonOptions: typeof DEFAULT_REASON_OPTIONS;
    files: DriverExecutionAttachment[];
    onDraftChange: (patch: Partial<OrderDraft>) => void;
    onOpenDetail: () => void;
    onUpload: () => void;
    onRemoveAttachment: (file: DriverExecutionAttachment) => void;
}

function OrderCard(props: OrderCardProps) {
    const { order, draft, signOptions, reasonOptions, files, onDraftChange, onOpenDetail, onUpload, onRemoveAttachment } = props;
    const orderStage = getOrderStage(order);
    const signIndex = Math.max(
        0,
        signOptions.findIndex((option) => option.value === draft.signStatus)
    );
    const reasonIndex = Math.max(
        0,
        reasonOptions.findIndex((option) => option.value === draft.reasonCode)
    );
    const orderDone = (order.pendingPackageCount || 0) <= 0;

    return (
        <View className="order-block">
            <View className="order-head">
                <Text className="order-no">运输订单：{order.orderNo || order.orderId}</Text>
                <Text className={`status-tag status-${orderStage.type}`}>{orderStage.text}</Text>
            </View>
            {(order.customerName || order.consignee) && (
                <View className="order-customer">
                    客户：{order.customerName || "-"} {order.consignee ? `（${order.consignee}）` : ""}
                </View>
            )}

            {orderDone ? (
                <View className="sign-line sign-done">正常签收（已签收，不可修改）</View>
            ) : order.canSign === false ? (
                <View className="sign-line sign-blocked">{order.blockedReason || "当前订单暂不可签收"}</View>
            ) : (
                <View className="sign-line">
                    <Text className="sign-label">签收状态：</Text>
                    <Picker
                        mode="selector"
                        range={signOptions}
                        rangeKey="label"
                        value={signIndex}
                        onChange={(event) => onDraftChange({ signStatus: signOptions[Number(event.detail.value)].value })}
                    >
                        <View className="sign-picker">
                            <Text>{signOptions[signIndex]?.label}</Text>
                            <AtIcon value="chevron-down" size={12} />
                        </View>
                    </Picker>
                    <View className="detail-btn" onClick={onOpenDetail}>
                        修改签收明细
                    </View>
                </View>
            )}

            <View className="order-stats">
                <View className="order-stat">
                    <View className="stat-label">总件数</View>
                    <View className="stat-value">{order.totalPackageCount ?? 0}</View>
                </View>
                <View className="order-stat">
                    <View className="stat-label">已签件数</View>
                    <View className="stat-value stat-green">{order.signedPackageCount ?? 0}</View>
                </View>
                <View className="order-stat">
                    <View className="stat-label">待签件数</View>
                    <View className="stat-value stat-orange">{order.pendingPackageCount ?? 0}</View>
                </View>
                <View className="order-stat">
                    <View className="stat-label">本次签收</View>
                    <View className="stat-value stat-blue">{draft.selectedCount}</View>
                </View>
            </View>

            {order.transportRequirements && (
                <View className="requirement">
                    <Text className="requirement-label">运输要求：</Text>
                    <Text>{order.transportRequirements}</Text>
                </View>
            )}

            {!orderDone && order.canSign !== false && draft.signStatus === 20 && (
                <View className="abnormal-box">
                    <Picker
                        mode="selector"
                        range={reasonOptions}
                        rangeKey="label"
                        value={reasonIndex}
                        onChange={(event) => onDraftChange({ reasonCode: reasonOptions[Number(event.detail.value)].value })}
                    >
                        <View className="reason-picker">
                            <Text className="reason-label">异常原因：</Text>
                            <Text>{reasonOptions[reasonIndex]?.label}</Text>
                            <AtIcon value="chevron-down" size={12} />
                        </View>
                    </Picker>
                    <Textarea
                        className="remark-input"
                        value={draft.remark}
                        maxlength={1000}
                        placeholder="请填写异常签收原因（必填）"
                        onInput={(event) => onDraftChange({ remark: event.detail.value })}
                    />
                </View>
            )}

            <View className="attach-header">
                <Text className="attach-title">签收凭证</Text>
                {!orderDone && order.canSign !== false && (
                    <View className="attach-upload" onClick={onUpload}>
                        <AtIcon value="camera" size={13} />
                        <Text>上传</Text>
                    </View>
                )}
            </View>
            <AttachmentList files={files} onPreview={(file) => previewAttachment(file)} onRemove={onRemoveAttachment} />
        </View>
    );
}

export default OrderCard;
