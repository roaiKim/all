import React from "react";
interface ColDecoratorMap {
    /**
     * 是否忽略请求
     */
    ignoreRequest?: boolean;
    /**
     * 是否可以排序
     */
    sort?: boolean;
    /**
     * 请求key
     */
    queKey?: string;
    /**
     * 是否锁定
     */
    locked?: boolean;
    /**
     * 是否可以 模糊搜索(指列表上方的搜索框)
     */
    search?: boolean;
}

interface StaticOption {
    key: string | number;
    value: string | number;
    style?: React.CSSProperties;
}

type FilterType = "input" | "select" | "time" | "number" | "custom";

interface Filter {
    mode: "AND" | "OR";
    filterTypes: FilterType[];
}

interface FiterConfig {
    filter: Filter[];
}

/**
 * CUSTOMER STRING OPTION DATE 这4选1
 */

/**
 * @description 表格自定义渲染装饰器
 * @param title 名称
 * @param width 宽度
 * @param map 其他字段
 * @returns
 */
export function CUSTOMER(title: string, map?: ColDecoratorMap) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "customer";
        descriptor.value!.columnName = title;
        descriptor.value!.columnMap = map;
        return descriptor;
    };
}

/**
 * @description 表格 string 渲染装饰器
 * @param title 名称
 * @param map 其他字段
 * @returns
 */
export function STRING(title: string, map?: ColDecoratorMap) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "string";
        descriptor.value!.columnName = title;
        descriptor.value!.columnMap = map;
        return descriptor;
    };
}

/**
 * @description 表格 选项枚举 渲染装饰器
 * @param title 名称
 * @param map 其他字段
 * @returns
 */
export function OPTION(title: string, staticOption: StaticOption[], map?: ColDecoratorMap) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "option";
        descriptor.value!.columnName = title;
        descriptor.value!.columnStaticOption = staticOption;
        descriptor.value!.columnMap = map;
        return descriptor;
    };
}

/**
 * @description 表格 日期 渲染装饰器
 * @param title 名称
 * @param map 其他字段
 * @returns
 */
export function DATE(title: string, dataType: string = "YYYY-MM-DD HH:mm", map?: ColDecoratorMap) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnType = "date";
        descriptor.value!.columnDataType = dataType;
        descriptor.value!.columnName = title;
        descriptor.value!.columnMap = map;
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

/**
 * @description
 * @param config FiterConfig
 * @returns
 */
export function CONFIG(config: FiterConfig) {
    return (target, propertyKey, descriptor) => {
        descriptor.value!.columnConfig = config;
        return descriptor;
    };
}
