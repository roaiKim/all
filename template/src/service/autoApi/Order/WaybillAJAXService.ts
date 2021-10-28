/* eslint-disable quotes */
import { WaybillQueryCondition, WaybillVO } from "../orderType";
import { ajax } from "core";

// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillAJAXService {
    /**
     * @description 删除
     * @param in body {number[]} ids
     * @returns object
     */
    public static deleteUsingPOST_6(ids: number[]): Promise<object> {
        return ajax("POST", `/waybill/delete`, {}, { ids });
    }

    /**
     * @description 列表
     * @param in body {WaybillQueryCondition} queryCondition
     * @returns object
     */
    public static getListUsingPOST(queryCondition: WaybillQueryCondition): Promise<object> {
        return ajax("POST", `/waybill/list`, {}, { queryCondition });
    }

    /**
     * @description 上报
     * @param in path {number} id
     * @returns object
     */
    public static reportUsingGET(id: number): Promise<object> {
        return ajax("GET", `/waybill/report/{id}`, { id }, {});
    }

    /**
     * @description 保存
     * @param in body {WaybillVO} waybillVO
     * @returns object
     */
    public static saveUsingPOST_5(waybillVO: WaybillVO): Promise<object> {
        return ajax("POST", `/waybill/save`, {}, { waybillVO });
    }

    /**
     * @description 获取明细
     * @param in path {number} id
     * @returns object
     */
    public static getOneUsingGET_1(id: number): Promise<object> {
        return ajax("GET", `/waybill/{id}`, { id }, {});
    }
}
