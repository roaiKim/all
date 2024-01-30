import { ToLowerCamelCase } from "type";

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
