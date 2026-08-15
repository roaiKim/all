import { ModuleStatus } from "type";
import { isDevelopment } from "config/static-constant";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const mainEntryTypeFile = require.context("module/", true, /\/type\.ts$/);
const modulesPath: string[] = mainEntryTypeFile.keys().filter((item: string) => !item.startsWith("./common"));

// 加载 默认的tabs
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const defaultTabsModule = require.context("config/", true, /tabs.(t|j)s$/);
const defaultTabsPath = defaultTabsModule.keys(); //.filter((item: string) => item.startsWith("config"));

interface CacheModules extends ModuleStatement {
    filePath: string;
}

export function loadCacheModule() {
    const systemModules: Map<string, CacheModules> = new Map();
    // 模块path转模块name
    const pathToName: Map<string, string> = new Map();
    // 模块name转模块path
    const nameToPath: Map<string, string> = new Map();
    modulesPath.forEach((id) => {
        const AllExport: any = mainEntryTypeFile(id);
        const statement: ModuleStatement = AllExport.statement;
        if (statement) {
            const { name, path } = statement;
            if (isDevelopment) {
                // 只能 小写 最多包含一个 - 的字母串 // 例如 a, a-b
                if (!/^[a-z]+?-?[a-z]+?$/.test(name || "")) {
                    throw new Error(`模块名(${name})不合法, 名称只能小写最多中间包含一个中划线(-)的字母组合`);
                }
            }
            if (path) {
                pathToName.set(path, name);
                nameToPath.set(name, path);
            }
            if (systemModules.has(path)) {
                throw new Error(`模块名(${name})重复, 重复路径为${id}、${path}`);
            } else {
                systemModules.set(path, Object.assign(statement, { filePath: id }));
            }
        }
    });

    const deafaultTabs = [];
    const defaultTabsFile = defaultTabsPath?.[0];
    if (defaultTabsFile) {
        const AllExport: any = defaultTabsModule(defaultTabsFile);
        if (AllExport.default) {
            const tabsPath = AllExport.default;
            tabsPath.forEach((item) => {
                if (systemModules.has(item) && isDevelopment) {
                    const module = systemModules.get(item);
                    deafaultTabs.push({
                        key: module.name,
                        label: module.title,
                        type: ModuleStatus.EXIST,
                        noClosed: false,
                    });
                }
            });
        }
    }
    if (process.env.NODE_ENV === "development") {
        // @ts-ignore
        window.__DEV_ROSEN__ = { deafaultTabs, systemModules, nameToPath, pathToName };
    }
    return { deafaultTabs, systemModules, nameToPath, pathToName };
}

const localModules = loadCacheModule();

export default localModules;
