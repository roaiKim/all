import { AtIcon, AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import { DriverExecutionPackageGroup } from "@api/DriverExecutionService";
import { Input, ScrollView, Text, View } from "@tarojs/components";

interface ReceiptDetailModalProps {
    visible: boolean;
    groups: DriverExecutionPackageGroup[];
    selectedCount: number;
    onClose: () => void;
    onSave: () => void;
    onCountChange: (value: string) => void;
    onGroupClick: (index: number) => void;
}

function ReceiptDetailModal(props: ReceiptDetailModalProps) {
    const { visible, groups, selectedCount, onClose, onSave, onCountChange, onGroupClick } = props;

    return (
        <AtModal className="ro-receipt-modal" isOpened={visible} closeOnClickOverlay={false} onClose={onClose}>
            <AtModalHeader>修改签收明细</AtModalHeader>
            <AtModalContent>
                <View className="detail-desc">按接口返回的完整包装组签收，不支持拆分半箱或重复占箱</View>
                <View className="detail-summary">
                    待签包装组 {groups.length} 组，本次签收 {selectedCount} 组
                </View>
                <View className="detail-input-row">
                    <Text className="detail-input-label">本次签收</Text>
                    <Input
                        className="detail-input"
                        type="number"
                        value={String(selectedCount)}
                        onInput={(event) => onCountChange(event.detail.value)}
                    />
                    <Text className="detail-input-unit">组</Text>
                </View>
                <ScrollView className="group-list" scrollY>
                    {groups.slice(0, 100).map((group, index) => {
                        const checked = index < selectedCount;
                        const itemSummary = (group.items || [])
                            .map((item) => `${item.itemCode || ""} ${item.itemName || ""}×${item.pcs ?? 0}`)
                            .filter(Boolean)
                            .join("；");
                        return (
                            <View className={`group-row ${checked ? "selected" : ""}`} key={group.packageGroupId} onClick={() => onGroupClick(index)}>
                                <View className={`group-check ${checked ? "checked" : ""}`}>{checked && <AtIcon value="check" size={10} />}</View>
                                <View className="group-main">
                                    <View className="group-title">箱号：{group.boxNo || `包装组 ${index + 1}`}</View>
                                    <View className="group-desc">
                                        {itemSummary || `重量 ${group.weight ?? "-"}kg / 体积 ${group.volume ?? "-"}m³`}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                {groups.length > 100 && <View className="group-more">仅展示前 100 组，可在上方直接输入本次签收组数</View>}
            </AtModalContent>
            <AtModalAction>
                <View className="modal-cancel" onClick={onClose}>
                    取消
                </View>
                <View className="modal-confirm" onClick={onSave}>
                    保存
                </View>
            </AtModalAction>
        </AtModal>
    );
}

export default ReceiptDetailModal;
