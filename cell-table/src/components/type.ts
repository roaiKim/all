export abstract class ColumnsService {
    protected constructor() {}
}

export type RenderColumnType = "customer" | "string" | "option" | "date" | "ignore";

export const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export type CellTableColumn = [
    string,
    string,
    (((value: string, rowData: object, rowIndex: number, colIndex: number, colKey: string) => any) | true)?,
    number?
];

interface StaticOption {
    key: string | number;
    value: string | number;
    style?: React.CSSProperties;
}

/**
 * CUSTOMER STRING OPTION DATE 这4选1
 */

/**
 * @description 表格自定义渲染装饰器
 * @param title 名称
 * @param width 宽度
 * @returns
 */
export function CUSTOMER(title: string) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "customer";
        descriptor.value!.columnName = title;
        return descriptor;
    };
}

/**
 * @description 表格 string 渲染装饰器
 * @param title 名称
 * @returns
 */
export function STRING(title: string) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "string";
        descriptor.value!.columnName = title;
        return descriptor;
    };
}

/**
 * @description 表格 选项枚举 渲染装饰器
 * @param title 名称
 * @returns
 */
export function OPTION(title: string, staticOption: StaticOption[]) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "option";
        descriptor.value!.columnName = title;
        descriptor.value!.columnStaticOption = staticOption;
        return descriptor;
    };
}

/**
 * @description 表格 日期 渲染装饰器
 * @param title 名称
 * @returns
 */
export function DATE(title: string, dataType: string = "YYYY-MM-DD HH:mm") {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "date";
        descriptor.value!.columnDataType = dataType;
        descriptor.value!.columnName = title;
        return descriptor;
    };
}

/**
 * @description 忽略当前字段 列表不显示 但是会请求
 * @param quekey 请求key
 * @param search 是否可以 模糊搜索(指列表上方的搜索框)
 * @returns
 */
export function IGNORE(quekey?: string, search?: boolean) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "ignore";
        descriptor.value!.columnMap = { quekey, search };
        return descriptor;
    };
}

/**
 * @description 宽度设置
 * @param width 默认宽度
 */
export function WIDTH(width: number) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnWidth = width;
        return descriptor;
    };
}
