import { APIException } from "@core";
import { DriverExecutionAttachment, DriverExecutionService } from "@api/DriverExecutionService";
import Taro from "@tarojs/taro";

/**
 * @description 自动显示/隐藏 loading。
 * @param autoLoading 是否显示 loading
 * @param title loading 文案
 */
export function autoShowLoading(autoLoading: boolean, title = "加载中") {
    if (autoLoading) {
        Taro.showLoading({ title });
    } else {
        Taro.hideLoading();
    }
}

/**
 * @description 复制到剪切板。
 * @param data 要复制的文本
 */
export function copyToClipboard(data = "") {
    Taro.setClipboardData({
        data,
        success() {
            Taro.getClipboardData({
                success() {
                    Taro.showToast({
                        title: "成功复制到剪贴板!",
                        icon: "none",
                        mask: true,
                        duration: 2000,
                    });
                },
            });
        },
    });
}

/**
 * @description 判断是否为 API 异常。
 * @param error 错误对象
 * @returns 是否为 APIException
 */
export function isAPIException(error): boolean {
    return error instanceof APIException;
}

/**
 * @description 显示 Toast 并延迟指定秒数。
 * @param title Toast 文案
 * @param delay 延迟秒数
 * @returns 延迟结束后的 Promise
 */
export function delayToast(title: string, delay = 2) {
    Taro.showToast({ title });
    return new Promise((resolve) => {
        setTimeout(resolve, delay * 1000);
    });
}

/**
 * @description 文件大小格式化。
 * @param size 文件大小（字节），为空时返回空字符串
 * @returns 小于 1MB 返回 KB，否则返回 MB
 */
export function formatFileSize(size?: number): string {
    if (!size) {
        return "";
    }
    if (size < 1024 * 1024) {
        return `${Math.ceil(size / 1024)}KB`;
    }
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

/**
 * @description 鉴权文件预览。图片使用 previewImage，PDF 使用 openDocument；文件流通过附件下载接口获取。
 * @param file 附件数据，需包含 attachmentId、fileName
 */
export async function previewAttachment(file: DriverExecutionAttachment): Promise<void> {
    const filePath = await DriverExecutionService.downloadAttachment(file.attachmentId, "preview");
    if ((file.fileName || "").toLowerCase().endsWith(".pdf")) {
        await Taro.openDocument({ filePath, fileType: "pdf", showMenu: true });
        return;
    }
    await Taro.previewImage({ urls: [filePath] });
}

/**
 * @description 生成写操作 requestId（8～64 位字母、数字、下划线或连字符）。
 * @param prefix 业务前缀
 * @returns requestId
 */
export function createRequestId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * @description 获取幂等 requestId：相同业务内容复用，内容变化重新生成。
 * @param cache 组件内的 requestId 缓存
 * @param prefix 业务前缀
 * @param payload 请求业务内容，用于判断是否复用
 * @returns requestId
 */
export function getOrCreateRequestId(cache: Record<string, string>, prefix: string, payload: unknown): string {
    const key = `${prefix}:${JSON.stringify(payload)}`;
    if (!cache[key]) {
        cache[key] = createRequestId(prefix);
    }
    return cache[key];
}

/**
 * @description 判断 chooseImage 是否由用户取消触发。
 * @param error catch 到的错误
 * @returns 是否为取消
 */
export function isChooseImageCancel(error: unknown): boolean {
    const exception = error as { errMsg?: string } | null;
    const message = exception?.errMsg || String(error);
    return message.includes("cancel");
}
