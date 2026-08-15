import { pushHistory } from "@core";
import { lessPrefixName, NON_EXIST_PATH } from "config/static-constant";
import localModules from "utils/function/load-modules";
import { getPathByKey } from "./path-mapping";

export const joinLessPrefix = (suffix: string | string[]) => {
    if (Array.isArray(suffix)) {
        return suffix.map((item) => `${lessPrefixName}-${item}`).join(" ");
    }
    return `${lessPrefixName}-${suffix}`;
};

export const joinPrefix = (string: string, suffix = "/") => (string.startsWith(suffix) ? string : `${suffix}${string}`);

export const clickMenuToTab = (key: string) => {
    const cacheKey = joinPrefix(key);
    console.log("--localModules--", key, localModules);

    // const cacheModule = localModules.systemModules.get(cacheKey) || getPathByKey(cacheKey) || getPathByKey(key);
    const path = localModules.pathToName.get(cacheKey) || getPathByKey(cacheKey);
    if (path) {
        // const path = localModules.pathToName.get(cacheKey) || getPathByKey(cacheKey) || getPathByKey(key);
        console.log("--path--", path);
        pushHistory(joinPrefix(path || cacheKey));
    } else {
        pushHistory(NON_EXIST_PATH);
    }
};
