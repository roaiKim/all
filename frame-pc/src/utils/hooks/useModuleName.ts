import { useContext } from "react";
import { ModuleNameContext } from "@core";

/**
 * @description 获取当前模块的名称
 * @returns 返回module的名称
 */
export function useModuleName() {
    const moduleName = useContext(ModuleNameContext);

    return moduleName;
}
