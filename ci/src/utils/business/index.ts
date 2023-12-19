import { AdditionMessage, ToLowerCamelCase } from "type";
import { AdvancedTableSource } from "type/api.type";
import { PageTableRequest } from "@api/AdvancedTableService";

/**
 * @description 把中划线(-)连接的形式 转化成小驼峰形式
 * @param moduleName 模块名称
 * @returns 转成小驼峰格式
 */
export function toLowerCamelCase<P extends string>(moduleName: P): ToLowerCamelCase<P> {
    return moduleName
        .split("-")
        .map((_, index) => (index > 0 ? _.substring(0, 1).toUpperCase() + _.slice(1) : _))
        .join("") as ToLowerCamelCase<P>;
}

/**
 * @description 初始化 表格数据
 * @returns
 */
export function initialTableSource() {
    return {
        source: {
            data: [],
            pageIndex: 1,
            pageSize: 20,
            total: "0",
        },
    };
}

/**
 * @description 组合table信息
 */
export function combineTable<T>(
    prevTable: AdvancedTableSource<T>,
    source: AdvancedTableSource<T>["source"],
    ment?: Omit<AdvancedTableSource<T>, "source">
): AdvancedTableSource<T> {
    return {
        ...prevTable,
        source,
        ...ment,
    };
}

/**
 * @description 组合 详情 信息
 */
export function combineAddition<T>(prevTable: AdditionMessage<T>, addition: T | null, ment?: Omit<AdditionMessage<T>, "addition">): AdditionMessage<T> {
    return {
        ...prevTable,
        addition,
        ...ment,
    };
}

/**
 * @description 拼接默认参数
 * @param request 高级查询参数
 * @returns 高级查询参数
 */
export function defaultPageTableRequest(request?: Partial<PageTableRequest>): PageTableRequest {
    return {
        offset: 0,
        limit: 20,
        pageNo: 1,
        pageSize: 20,
        selectColumns: ["*"],
        conditionBodies: [],
        orders: [{ orderBy: "createTime", ascending: false }],
        ...(request || {}),
    };
}
