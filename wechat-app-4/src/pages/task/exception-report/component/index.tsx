import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { AtIcon } from "taro-ui";
import { DriverExecutionExceptionCategory } from "@api/DriverExecutionService";
import { actions } from "@pages/task/exception-report";
import { Text, Textarea, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { backHistory } from "@utils";
import { getOrCreateRequestId, isChooseImageCancel, previewAttachment } from "@utils/functions";
import { Toast } from "@utils/ui/toast";
import { EXCEPTION_STAGE_LABELS } from "../type";
import "./index.less";

function ExceptionReport(props: ReturnType<typeof mapStateToProps>) {
    const { entrustId, taskId, prepare, stage, attachments, reportResult, actionLoading } = props;
    const dispatch = useDispatch();
    const requestIds = useRef<Record<string, string>>({});
    const [categoryCode, setCategoryCode] = useState("");
    const [level, setLevel] = useState<number | null>(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!reportResult) {
            return;
        }
        Taro.showModal({
            title: "上报成功",
            content: `异常单号：${reportResult.exceptionNumber || "-"}\n状态：${reportResult.statusName || "待受理"}`,
            showCancel: false,
        }).then(() => {
            dispatch(actions.clearReportResult());
            backHistory();
        });
    }, [reportResult, dispatch]);

    useEffect(() => {
        const category = (prepare?.categories || []).find((item) => item.enabled && (item.levels || []).length > 0);
        setCategoryCode(category?.code || "");
        setLevel(category?.levels?.[0]?.code ?? null);
        setDescription("");
    }, [prepare]);

    if (!prepare) {
        return (
            <View className="ro-exception-page">
                <View className="empty-tip">加载中...</View>
            </View>
        );
    }

    const categories = prepare.categories || [];
    const selectedCategory = categories.find((item) => item.code === categoryCode);
    const levels = selectedCategory?.levels || [];
    const orders = prepare.orders || [];
    const maxLength = prepare.maxDescriptionLength || 2000;
    const hasDisabledCategory = categories.some((item) => !item.enabled);

    const handleSelectCategory = (category: DriverExecutionExceptionCategory) => {
        if (!category.enabled) {
            Toast.text(category.disabledReason || "当前异常类别不可提交");
            return;
        }
        if ((category.levels || []).length === 0) {
            Toast.text("当前类别没有可用级别");
            return;
        }
        setCategoryCode(category.code);
        setLevel(category.levels[0].code);
    };

    const handleUploadPhoto = async () => {
        const remain = 20 - attachments.length;
        if (remain <= 0) {
            Toast.text("异常照片最多上传20张");
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
            dispatch(actions.uploadPhotos(entrustId, taskId, media.tempFilePaths));
        }
    };

    const handleSubmit = () => {
        if (!selectedCategory || !selectedCategory.enabled) {
            Toast.text("请选择有效的异常类别");
            return;
        }
        if (level === null || level === undefined) {
            Toast.text("请选择异常级别");
            return;
        }
        if (!description.trim()) {
            Toast.text("请填写异常描述");
            return;
        }

        const payload = {
            entrustId,
            taskId,
            stage,
            expectedVersion: prepare.expectedVersion,
            categoryCode,
            level,
            description: description.trim(),
            attachmentIds: attachments.map((file) => file.attachmentId),
        };
        dispatch(actions.submit({ ...payload, requestId: getOrCreateRequestId(requestIds.current, "exception_report", payload) }));
    };

    return (
        <View className="ro-exception-page">
            <View className="info-card">
                <View className="info-title">运输异常上报</View>
                <View className="info-line">
                    <Text className="label">入口阶段：</Text>
                    <Text>{EXCEPTION_STAGE_LABELS[stage]}</Text>
                </View>
                <View className="info-line">
                    <Text className="label">任务ID：</Text>
                    <Text>{prepare.taskId}</Text>
                </View>
                {prepare.orderScope && (
                    <View className="info-line">
                        <Text className="label">影响范围：</Text>
                        <Text>{prepare.orderScope}</Text>
                    </View>
                )}
                {orders.length > 0 && (
                    <View className="order-chips">
                        {orders.map((order) => (
                            <Text className="order-chip" key={order.orderId}>
                                {order.orderNumber || order.orderId}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            <View className="section-title">异常类型</View>
            <View className="chip-wrap">
                {categories.map((category) => (
                    <View
                        className={`chip ${category.enabled ? "" : "chip-disabled"} ${category.code === categoryCode ? "chip-active" : ""}`}
                        key={category.code}
                        onClick={() => handleSelectCategory(category)}
                    >
                        {category.name}
                    </View>
                ))}
                {categories.length === 0 && <View className="section-hint">当前任务暂无可提交的异常类别</View>}
            </View>
            {hasDisabledCategory && <View className="section-hint">置灰类别当前不可提交，可联系调度确认</View>}

            <View className="section-title">异常级别</View>
            <View className="chip-wrap">
                {levels.map((item) => (
                    <View className={`chip ${item.code === level ? "chip-active" : ""}`} key={item.code} onClick={() => setLevel(item.code)}>
                        {item.name}
                    </View>
                ))}
                {levels.length === 0 && <View className="section-hint">请先选择有效的异常类别</View>}
            </View>

            <View className="section-title">异常描述</View>
            <View className="textarea-card">
                <Textarea
                    className="description-input"
                    value={description}
                    maxlength={maxLength}
                    placeholder="请描述异常发生的时间、地点、货物情况等"
                    onInput={(event) => setDescription(event.detail.value)}
                />
                <View className="counter">
                    {description.length}/{maxLength}
                </View>
            </View>

            <View className="section-title">异常照片（选传）</View>
            <View className="photo-card">
                <View className="upload-area" onClick={handleUploadPhoto}>
                    <AtIcon value="camera" size={32} />
                    <View className="upload-text">点击上传异常照片</View>
                    <View className="upload-desc">支持拍照或从相册选择（图片）</View>
                </View>
                {attachments.length === 0 ? (
                    <View className="photo-empty">暂无照片</View>
                ) : (
                    attachments.map((file) => (
                        <View className="photo-row" key={file.attachmentId}>
                            <AtIcon value="image" size={16} />
                            <Text className="photo-name">{file.fileName || "异常照片"}</Text>
                            <Text className="photo-action" onClick={() => previewAttachment(file)}>
                                查看
                            </Text>
                            <Text className="photo-action danger" onClick={() => dispatch(actions.removePhoto(file))}>
                                删除
                            </Text>
                        </View>
                    ))
                )}
                {prepare.evidenceRequired && <View className="photo-hint">当前异常场景需上传证据照片</View>}
            </View>

            <View className={`submit-btn ${actionLoading ? "disabled" : ""}`} onClick={() => !actionLoading && handleSubmit()}>
                {actionLoading ? "提交中..." : "提交上报"}
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        entrustId: state.app.exceptionReport.entrustId,
        taskId: state.app.exceptionReport.taskId,
        prepare: state.app.exceptionReport.prepare,
        stage: state.app.exceptionReport.stage,
        attachments: state.app.exceptionReport.attachments,
        reportResult: state.app.exceptionReport.reportResult,
        actionLoading: showLoading(state, "exceptionAction"),
    };
};

export default connect(mapStateToProps)(ExceptionReport);
