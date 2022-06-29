import { ComponentType } from "react";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const modules = require.context("module/", true, /type\.ts$/);
const modulesId: string[] = modules.keys().filter((item: string) => item.startsWith("module"));

export declare interface ModuleStatement {
    path: string;
    title: string;
    icon?: string;
    disabled?: boolean;
    order?: number;
    component: ComponentType<any>;
}

export const cacheModules = modulesId
    .map((id) => ({
        moduleId: id,
        module: modules(id).statement as ModuleStatement,
    }))
    .filter((item) => !!item.module)
    .filter((item) => !item.module.disabled)
    .sort((prev, next) => (prev.module.order || 9) - (next.module.order || 10));
