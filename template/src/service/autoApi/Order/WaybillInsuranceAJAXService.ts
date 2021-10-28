/* eslint-disable quotes */
import { WaybillInsuranceQueryCondition, WaybillInsurance } from "../orderType";
import { ajax } from "core";

// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillInsuranceAJAXService {
    /**
     * @description edit
     * @param in path {number} id
     * @returns object
     */
    public static editUsingGET(id: number): Promise<object> {
        return ajax("GET", `/waybillInsurance/delete/{id}`, { id }, {});
    }

    /**
     * @description electronicPolicy
     * @param in path {number} id
     * @returns object
     */
    public static electronicPolicyUsingPOST(id: number): Promise<object> {
        return ajax("POST", `/waybillInsurance/generate/electronicPolicy/{id}`, { id }, {});
    }

    /**
     * @description list
     * @param in body {WaybillInsuranceQueryCondition} waybillInsuranceQueryCondition
     * @returns object
     */
    public static listUsingPOST_5(waybillInsuranceQueryCondition: WaybillInsuranceQueryCondition): Promise<object> {
        return ajax("POST", `/waybillInsurance/list`, {}, { waybillInsuranceQueryCondition });
    }

    /**
     * @description save
     * @param in body {WaybillInsurance} waybillInsurance
     * @returns object
     */
    public static saveUsingPOST_6(waybillInsurance: WaybillInsurance): Promise<object> {
        return ajax("POST", `/waybillInsurance/save`, {}, { waybillInsurance });
    }

    /**
     * @description get
     * @param in path {number} id
     * @returns object
     */
    public static getUsingGET_1(id: number): Promise<object> {
        return ajax("GET", `/waybillInsurance/{id}`, { id }, {});
    }
}
