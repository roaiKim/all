import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import { Input, Textarea, View } from "@tarojs/components";
import { NumberFieldKey, numberFormFields, textFormFields } from "./helper";
import { PickupForm } from "../type";

interface PickupInfoModalProps {
    visible: boolean;
    form: PickupForm;
    numberInputs: Record<NumberFieldKey, string>;
    showContainerForm: boolean;
    actionLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onNumberInput: (key: NumberFieldKey, value: string) => void;
    onTextChange: (patch: Partial<PickupForm>) => void;
}

function PickupInfoModal(props: PickupInfoModalProps) {
    const { visible, form, numberInputs, showContainerForm, actionLoading, onClose, onConfirm, onNumberInput, onTextChange } = props;
    const showVgmReason =
        form.tareWeight !== null &&
        form.cargoWeight !== null &&
        form.vgmWeight !== null &&
        Math.abs(form.tareWeight + form.cargoWeight - form.vgmWeight) > 0.01;

    return (
        <AtModal className="ro-pickup-modal" isOpened={visible} closeOnClickOverlay={false} onClose={onClose}>
            <AtModalHeader>提货装车信息确认</AtModalHeader>
            <AtModalContent>
                <View className="form-item">
                    <View className="form-label">送货单份数</View>
                    <Input
                        className="form-input"
                        type="number"
                        value={numberInputs.deliveryCopies}
                        onInput={(event) => onNumberInput("deliveryCopies", event.detail.value)}
                    />
                </View>
                {showContainerForm && (
                    <View className="form-section">
                        <View className="form-section-title">集装箱信息</View>
                        {textFormFields.map((field) => (
                            <View className="form-item" key={field.key}>
                                <View className="form-label">{field.label}</View>
                                <Input
                                    className="form-input"
                                    type="text"
                                    value={form[field.key]}
                                    onInput={(event) => onTextChange({ [field.key]: event.detail.value })}
                                />
                            </View>
                        ))}
                        {numberFormFields.map((field) => (
                            <View className="form-item" key={field.key}>
                                <View className="form-label">{field.label}</View>
                                <Input
                                    className="form-input"
                                    type="digit"
                                    value={numberInputs[field.key]}
                                    onInput={(event) => onNumberInput(field.key, event.detail.value)}
                                />
                            </View>
                        ))}
                    </View>
                )}
                {showVgmReason && (
                    <View className="form-item column">
                        <View className="form-label">VGM修正原因</View>
                        <Textarea
                            className="form-textarea"
                            value={form.vgmCorrectionReason}
                            maxlength={200}
                            placeholder="VGM重与空柜重+货重不一致时必填"
                            onInput={(event) => onTextChange({ vgmCorrectionReason: event.detail.value })}
                        />
                    </View>
                )}
            </AtModalContent>
            <AtModalAction>
                <View className="modal-cancel" onClick={onClose}>
                    取消
                </View>
                <View className={actionLoading ? "modal-confirm disabled" : "modal-confirm"} onClick={() => !actionLoading && onConfirm()}>
                    {actionLoading ? "提交中..." : "确认并提货"}
                </View>
            </AtModalAction>
        </AtModal>
    );
}

export default PickupInfoModal;
