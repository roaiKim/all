/**
 * @description 添加这个装饰器时 需要重新启动项目或运行 yarn auth 这个只是用来匹配的
 * @param moduleClass
 * @returns
 */
export function verifiable(moduleClass) {
    try {
        moduleClass.prototype.needAuth = true;
    } catch (e) {
        //
    }
    return moduleClass;
}
