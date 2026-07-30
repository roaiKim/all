import { pushHistory } from "@core";
import { lessPrefixName } from "config/static-constant";
import localModules from "utils/function/load-modules";
import { getPathByKey } from "./path-mapping";

export const joinLessPrefix = (suffix: string) => `${lessPrefixName}-${suffix}`;

export const joinPrefix = (string: string, suffix = "/") => (string.startsWith(suffix) ? string : `${suffix}${string}`);

export const clickMenuToTab = (key: string) => {
    const cacheKey = joinPrefix(key);
    console.log("--localModules--", localModules);
    const path = localModules.pathToName.get(cacheKey) || getPathByKey(cacheKey) || getPathByKey(key);
    console.log("--path--", path);
    pushHistory(joinPrefix(path || cacheKey));
};
