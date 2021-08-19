import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillInsuranceAJAXService {
    /**
     * @description edit
     * @returns object
     */
    public static editUsingGET(): Promise<object> {
        return ajax("GET", "/waybillInsurance/delete/{id}", {}, {});
    }

    /**
     * @description electronicPolicy
     * @returns object
     */
    public static electronicPolicyUsingPOST(): Promise<object> {
        return ajax("POST", "/waybillInsurance/generate/electronicPolicy/{id}", {}, {});
    }

    /**
     * @description list
     * @returns object
     */
    public static listUsingPOST_5(): Promise<object> {
        return ajax("POST", "/waybillInsurance/list", {}, {});
    }

    /**
     * @description save
     * @returns object
     */
    public static saveUsingPOST_6(): Promise<object> {
        return ajax("POST", "/waybillInsurance/save", {}, {});
    }

    /**
     * @description get
     * @returns object
     */
    public static getUsingGET_1(): Promise<object> {
        return ajax("GET", "/waybillInsurance/{id}", {}, {});
    }
}
