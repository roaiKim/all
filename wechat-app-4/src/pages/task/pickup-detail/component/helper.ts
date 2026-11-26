import {
    DriverExecutionAttachment,
    DriverExecutionContainerMaterial,
    DriverExecutionPickupPoint,
    DriverExecutionPickupTask,
} from "@api/DriverExecutionService";
import { PICKUP_TASK_STAGES, PickupForm, PickupStageInfo } from "../type";

/** @description 提货表单中的数字字段 key。 */
export type NumberFieldKey = "deliveryCopies" | "tareWeight" | "cargoWeight" | "vgmWeight";

export const initialPickupForm: PickupForm = {
    deliveryCopies: 1,
    containerNo: "",
    sealNo: "",
    tareWeight: null,
    cargoWeight: null,
    vgmWeight: null,
    vgmCorrectionReason: "",
};

export const textFormFields: { label: string; key: "containerNo" | "sealNo" }[] = [
    { label: "集装箱号", key: "containerNo" },
    { label: "封条号", key: "sealNo" },
];

export const numberFormFields: { label: string; key: "tareWeight" | "cargoWeight" | "vgmWeight" }[] = [
    { label: "空柜重(kg)", key: "tareWeight" },
    { label: "货重(kg)", key: "cargoWeight" },
    { label: "VGM重(kg)", key: "vgmWeight" },
];

/**
 * @description 计算提货任务状态：已全部提货优先，其次使用接口 displayStage。
 * @param task 提货任务
 * @returns 状态文案和样式类型
 */
export function getTaskStage(task: DriverExecutionPickupTask): PickupStageInfo {
    if (task.allPickupCompleted) {
        return PICKUP_TASK_STAGES.PICKED_UP;
    }
    return (task.displayStage && PICKUP_TASK_STAGES[task.displayStage]) || PICKUP_TASK_STAGES.WAIT_CHECK_IN;
}

/**
 * @description 计算提货点状态：已提货、待提货或待签到。
 * @param point 提货点
 * @returns 状态文案和样式类型
 */
export function getPointStage(point: DriverExecutionPickupPoint): PickupStageInfo {
    if (point.pickupConfirmed || point.state === "PICKED_UP") {
        return { text: "已提货", type: "done" };
    }
    if (point.checkedIn || point.checkedInAt || point.state === "WAIT_PICKUP") {
        return { text: "待提货", type: "progress" };
    }
    return { text: "待签到", type: "pending" };
}

/**
 * @description 将输入框文本转为数字，空字符串或非法数字返回 null。
 * @param value 输入框文本
 * @returns 数字或 null
 */
export function parseNumberInput(value: string): number | null {
    if (value.trim() === "") {
        return null;
    }
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
}

/**
 * @description 根据任务已保存的集装箱资料和提货点信息生成表单初始值。
 * @param task 提货任务
 * @param point 提货点
 * @returns 提货表单
 */
export function createPickupForm(task: DriverExecutionPickupTask, point: DriverExecutionPickupPoint): PickupForm {
    const material = task.containerMaterial || {};
    return {
        deliveryCopies: task.deliveryCopies || point.deliveryCopies || 1,
        containerNo: material.containerNo || "",
        sealNo: material.sealNo || "",
        tareWeight: material.tareWeight ?? null,
        cargoWeight: material.cargoWeight ?? null,
        vgmWeight: material.vgmWeight ?? null,
        vgmCorrectionReason: material.vgmCorrectionReason || "",
    };
}

/**
 * @description 将提货表单转换为接口 containerMaterial，空值不提交。
 * @param form 提货表单
 * @returns 集装箱资料或 undefined
 */
export function buildContainerMaterial(form: PickupForm): DriverExecutionContainerMaterial | undefined {
    const material: DriverExecutionContainerMaterial = {};
    if (form.containerNo.trim()) {
        material.containerNo = form.containerNo.trim();
    }
    if (form.sealNo.trim()) {
        material.sealNo = form.sealNo.trim();
    }
    if (form.tareWeight !== null) {
        material.tareWeight = form.tareWeight;
    }
    if (form.cargoWeight !== null) {
        material.cargoWeight = form.cargoWeight;
    }
    if (form.vgmWeight !== null) {
        material.vgmWeight = form.vgmWeight;
    }
    if (form.vgmCorrectionReason.trim()) {
        material.vgmCorrectionReason = form.vgmCorrectionReason.trim();
    }
    return Object.keys(material).length > 0 ? material : undefined;
}

/**
 * @description 提货确认前校验送货单份数、重量、集装箱资料和末点凭证。
 * @param task 提货任务
 * @param form 提货表单
 * @param voucherFiles 已上传的提货凭证
 * @returns 错误文案，校验通过返回空字符串
 */
export function validatePickup(task: DriverExecutionPickupTask, form: PickupForm, voucherFiles: DriverExecutionAttachment[]): string {
    if (form.deliveryCopies === null || !Number.isInteger(form.deliveryCopies) || form.deliveryCopies <= 0) {
        return "送货单份数必须为正整数";
    }

    if ([form.tareWeight, form.cargoWeight, form.vgmWeight].some((value) => value !== null && value < 0)) {
        return "重量不能为负数";
    }

    if (task.materialRequired && (!form.containerNo.trim() || !form.sealNo.trim())) {
        return "请填写集装箱号和封条号";
    }

    const willCompleteAll = task.totalPoints
        ? (task.completedPoints || 0) + 1 >= task.totalPoints
        : (task.pickupPoints || []).filter((point) => !point.pickupConfirmed).length <= 1;
    if (task.voucherRequired && willCompleteAll && voucherFiles.length === 0) {
        return "末点提货需先上传提货凭证";
    }

    if (
        form.tareWeight !== null &&
        form.cargoWeight !== null &&
        form.vgmWeight !== null &&
        Math.abs(form.tareWeight + form.cargoWeight - form.vgmWeight) > 0.01 &&
        !form.vgmCorrectionReason.trim()
    ) {
        return "VGM重与空柜重+货重不一致，请填写修正原因";
    }
    return "";
}
