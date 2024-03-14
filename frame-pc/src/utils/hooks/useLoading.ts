import { useSelector } from "react-redux";
import { State } from "@core";
import { useModuleName } from "./useModuleName";

/**
 * @description 获取表格是否在loading
 * @param pageTable string 表格的关键字
 * @returns boolean
 */
export function usePageLoading(pageTable = "main") {
    const moduleName = useModuleName();
    const identifier = `${moduleName}-${pageTable}-page-loading`;
    return useSelector((state: State) => state.loading[identifier] === 1);
}

/**
 * @description 获取 表格是否 loading 错误
 * @param pageTable string 表格的关键字
 * @returns boolean
 */
export function usePageError(pageTable = "main") {
    const moduleName = useModuleName();
    const identifier = `${moduleName}-${pageTable}-page-loading`;
    return useSelector((state: State) => state.loading[identifier] === 2);
}

/**
 * @description 获取弹窗是否在loading
 * @param pageModal string 详情弹窗的关键字
 * @returns boolean
 */
export function useAdditionLoading(pageModal = "main") {
    const moduleName = useModuleName();
    const identifier = `${moduleName}-${pageModal}-addition-loading`;
    return useSelector((state: State) => state.loading[identifier] === 1);
}

/**
 * @description 获取弹窗是否加载错误
 * @param pageModal string 详情弹窗的关键字
 * @returns boolean
 */
export function useAdditionError(pageModal = "main") {
    const moduleName = useModuleName();
    const identifier = `${moduleName}-${pageModal}-addition-loading`;
    return useSelector((state: State) => state.loading[identifier] === 2);
}
