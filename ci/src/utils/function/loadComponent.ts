import { ComponentType } from "react";
import { isDevelopment } from "config/static-envs";
import { HeaderTabType } from "module/common/header/type";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const modules = require.context("module/", true, /type\.ts$/);
const modulesId: string[] = modules.keys().filter((item: string) => item.startsWith("module"));

// 加载 默认的tabs
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const deafaultTabsModules = require.context("config/", true, /dev-tabs.ts$/);
const deafaultTabIds = deafaultTabsModules.keys().filter((item: string) => item.startsWith("config"));

// export const cacheModules = modulesId
//     .map((id) => ({
//         moduleId: id,
//         module: modules(id).statement as ModuleStatement,
//     }))
//     .filter((item) => !!item.module)
//     .filter((item) => !item.module.disabled)
//     .sort((prev, next) => (prev.module.order || 9) - (next.module.order || 10));

interface Cache {
    moduleId: string;
    module: ModuleStatement;
}

const modulesCache: Record<string, Cache> = {};

// 模块path转模块name
const pathToName = {};
// 模块name转模块path
const nameToPath = {};

modulesId.forEach((id) => {
    const statement: ModuleStatement = modules(id).statement;
    if (statement) {
        const { name, path } = statement;
        if (isDevelopment) {
            // 只能 小写 最多包含一个 - 的字母串 // 例如 rosen, rosen-one
            if (!/^[a-z]+?-?[a-z]+?$/.test(name || "")) {
                throw new Error(`模块名(${name})不合法, 名称只能小写最多中间包含一个中划线(-)的字母组合`);
            }
        }
        if (path) {
            pathToName[path] = name;
            nameToPath[name] = path;
        }
        if (modulesCache[name]) {
            const { moduleId } = modulesCache[name];
            throw new Error(`模块名(${name})重复, 重复路径为${id}、${moduleId}`);
        } else {
            modulesCache[name] = {
                moduleId: id,
                module: statement,
            };
        }
    }
});

// 开发环境默认的tabs
const deafaultTabPaths = deafaultTabIds.map((id) => deafaultTabsModules(id).default)?.[0] || [];
const deafaultTabs = deafaultTabPaths
    .map((item) => {
        if (modulesCache[item] && isDevelopment) {
            const { module } = modulesCache[item];
            return {
                key: module.name,
                label: module.title,
                type: HeaderTabType.A,
                noClosed: false,
            };
        }
    })
    .filter(Boolean);

export { deafaultTabs, modulesCache, nameToPath, pathToName };
