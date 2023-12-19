/**
 * @description 表格自定义渲染装饰器
 * @param title 名称
 * @param width 宽度
 * @param ignoreRequest 是否请求
 * @returns 、
 */
export function customer(title: string, width?: number, ignoreRequest?: boolean) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "customer";
        descriptor.value!.columnName = title;
        descriptor.value!.columnWidth = width;
        descriptor.value!.columnIgnoreRequest = ignoreRequest;
        return descriptor;
    };
}

export function string(title: string, width?: number, ignoreRequest?: boolean) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "string";
        descriptor.value!.columnName = title;
        descriptor.value!.columnWidth = width;
        descriptor.value!.columnIgnoreRequest = ignoreRequest;
        return descriptor;
    };
}
