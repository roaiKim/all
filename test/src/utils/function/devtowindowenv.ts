import dayjs from "dayjs";
import { isDevelopment } from "config/static-envs";
import { deafaultTabs, modulesCache, nameToPath, pathToName } from "./loadComponent";

if (isDevelopment) {
    // deafaultTabs, modulesCache, nameToPath, pathToName
    console.log("%c dev", "color: red");
    (window as any).__deafaultTabs = deafaultTabs;
    (window as any).__modulesCache = modulesCache;
    (window as any).__nameToPath = nameToPath;
    (window as any).__pathToName = pathToName;
    (window as any).__DAYJS = dayjs;
}
