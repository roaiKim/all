// 模块状态枚举 - 语义清晰、命名规范
export enum ModuleStatus {
    // 项目存在的模块
    EXIST = "exist",
    // 项目存在但无权限模块
    EXIST_NO_AUTH = "exist_no_auth",
    // 项目开发中的模块
    DEVELOPING = "developing",
    // 项目不存在的模块
    NON_EXIST = "non_exist",
}
