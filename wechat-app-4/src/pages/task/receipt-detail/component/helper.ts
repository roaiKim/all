import {
    DriverExecutionAbnormalReasonOption,
    DriverExecutionAttachment,
    DriverExecutionReceiptOrder,
    DriverExecutionReceiptTask,
    DriverExecutionSelectOption,
    DriverExecutionService$receiptRequest,
} from "@api/DriverExecutionService";
import { DEFAULT_REASON_OPTIONS, DEFAULT_SIGN_OPTIONS, OrderDraft, ReceiptStageInfo } from "../type";

/** @description W05/W06 请求体，requestId 由调用方补充。 */
export type ReceiptRequestPayload = Omit<DriverExecutionService$receiptRequest, "requestId">;

/**
 * @description 归一化签收状态选项，接口为空时使用默认选项。
 * @param options 接口返回的选项
 * @returns 签收状态选项
 */
export function normalizeSignOptions(options?: DriverExecutionSelectOption[]): typeof DEFAULT_SIGN_OPTIONS {
    if (!options || options.length === 0) {
        return DEFAULT_SIGN_OPTIONS;
    }
    const result = options
        .map((option) => {
            const value = Number(option.code ?? option.value);
            const label = option.name || option.label || String(option.code ?? option.value ?? "");
            return { value, label };
        })
        .filter((option) => Number.isFinite(option.value) && !!option.label);
    return result.length > 0 ? result : DEFAULT_SIGN_OPTIONS;
}

/**
 * @description 归一化异常原因选项，接口为空时使用默认选项。
 * @param options 接口返回的选项
 * @returns 异常原因选项
 */
export function normalizeReasonOptions(options?: DriverExecutionAbnormalReasonOption[]): typeof DEFAULT_REASON_OPTIONS {
    if (!options || options.length === 0) {
        return DEFAULT_REASON_OPTIONS;
    }
    const result = options
        .map((option) => ({
            value: option.reasonCode || option.code || option.value || "",
            label: option.reasonName || option.name || option.label || option.reasonCode || option.code || "",
        }))
        .filter((option) => !!option.value && !!option.label);
    return result.length > 0 ? result : DEFAULT_REASON_OPTIONS;
}

/**
 * @description 计算运输订单的签收状态。
 * @param order 运输订单
 * @returns 状态文案和样式类型
 */
export function getOrderStage(order: DriverExecutionReceiptOrder): ReceiptStageInfo {
    if ((order.pendingPackageCount || 0) <= 0) {
        return { text: "已签收", type: "done" };
    }
    if ((order.signedPackageCount || 0) > 0) {
        return { text: "部分签收", type: "progress" };
    }
    return { text: "待签收", type: "pending" };
}

/**
 * @description 汇总卸货点下所有订单，计算卸货点签收状态。
 * @param orders 卸货点订单
 * @returns 状态文案和样式类型
 */
export function getPointStage(orders: DriverExecutionReceiptOrder[]): ReceiptStageInfo {
    const totalPending = orders.reduce((sum, order) => sum + (order.pendingPackageCount || 0), 0);
    const totalSigned = orders.reduce((sum, order) => sum + (order.signedPackageCount || 0), 0);
    if (totalPending <= 0) {
        return { text: "已签收", type: "done" };
    }
    return totalSigned > 0 ? { text: "部分签收", type: "progress" } : { text: "待签收", type: "pending" };
}

/**
 * @description 校验当前卸货点草稿并组装 W05/W06 请求体。
 * @param entrustId 运输委托 ID
 * @param task 当前运输任务
 * @param point 当前卸货点
 * @param drafts 订单签收草稿
 * @param receiptFiles 订单已上传的签收凭证
 * @returns 错误文案或请求 payload
 */
export function buildReceiptRequest(
    entrustId: string,
    task: DriverExecutionReceiptTask,
    point: DriverExecutionReceiptTask["unloadPoints"][number],
    drafts: Record<string, OrderDraft>,
    receiptFiles: Record<string, DriverExecutionAttachment[]>
): { error: string; payload?: ReceiptRequestPayload } {
    const pendingOrders = (point.orders || []).filter((order) => (order.pendingPackageCount || 0) > 0 && order.canSign !== false);
    if (pendingOrders.length === 0) {
        return { error: "该卸货点暂无可签收订单" };
    }

    const orders = [];
    for (const order of pendingOrders) {
        const draft = drafts[order.orderId];
        if (!draft) {
            return { error: `【${order.orderNo || order.orderId}】签收信息未初始化` };
        }
        if (draft.packageGroupIds.length === 0) {
            return { error: `【${order.orderNo || order.orderId}】请选择本次签收包装` };
        }
        if (draft.selectedCount > (order.pendingPackageCount || 0)) {
            return { error: `【${order.orderNo || order.orderId}】本次签收数量不能大于待签数量` };
        }
        if (draft.signStatus === 20 && !draft.remark.trim()) {
            return { error: `【${order.orderNo || order.orderId}】异常签收需填写原因` };
        }
        orders.push({
            orderId: order.orderId,
            signStatus: draft.signStatus,
            remark: draft.remark.trim() || null,
            reasonCode: draft.reasonCode || null,
            packageGroupIds: draft.packageGroupIds,
            attachmentIds: (receiptFiles[order.orderId] || []).map((file) => file.attachmentId),
        });
    }

    return {
        error: "",
        payload: {
            entrustId,
            taskId: task.taskId,
            unloadPointId: point.unloadPointId,
            expectedVersion: task.version,
            signer: task.driverName || undefined,
            orders,
        },
    };
}
