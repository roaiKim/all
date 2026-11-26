/**
 * @description 添加这个装饰器时 过滤掉当前文件 yarn path:ast 和 yarn path 收取当前页面
 * @param moduleClass
 * @returns
 */
export function abandonPage(moduleClass) {
    try {
        moduleClass.prototype.abandon = true;
    } catch (e) {
        //
    }
    return moduleClass;
}
