import { ComponentType } from "react";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const modules = require.context("module/", true, /type\.ts$/);
const modulesId: string[] = modules.keys().filter((item: string) => item.startsWith("module"));

export declare interface ModuleStatement {
    name: string;
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

interface Cache {
    moduleId: string;
    module: ModuleStatement;
}

const cache: Record<string, Cache> = {};

const isDevelopment = process.env.NODE_ENV === "development";
modulesId.forEach((id) => {
    const statement: ModuleStatement = modules(id).statement;
    if (statement) {
        const { name } = statement;
        if (isDevelopment) {
            if (/^\/|\/$/g.test(name || "")) {
                throw new Error(`模块名(${name})不合法, 不能以/开头和结尾`);
            }
        }
        if (cache[name]) {
            const { moduleId } = cache[name];
            throw new Error(`模块名(${name})重复, 重复路径为${id}、${moduleId}`);
        } else {
            cache[name] = {
                moduleId: id,
                module: statement,
            };
        }
    }
});

export { cache };
