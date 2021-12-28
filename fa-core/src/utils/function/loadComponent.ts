import { ComponentType } from "react";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const modules = require.context("module/", true, /type\.ts$/);
// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesId: string[] = modules.keys().filter((item: string) => item.startsWith("module"));

export interface ModuleStatement {
    path: string;
    title: string;
    icon?: string;
    disabled?: boolean;
    component: ComponentType<object>;
}

export const cacheModules = modulesId
    .map((id) => ({
        moduleId: id,
        module: modules(id).statement as ModuleStatement,
    }))
    .filter((item) => !!item.module)
    .filter((item) => !item.module.disabled);
