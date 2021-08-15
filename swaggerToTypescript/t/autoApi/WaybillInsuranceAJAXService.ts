import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillInsuranceAJAXService {
    // edit;
    public static editUsingGET(): Promise<any> {
        return ajax("GET", "/waybillInsurance/delete/{id}", {}, {});
    }

    // electronicPolicy;
    public static electronicPolicyUsingPOST(): Promise<any> {
        return ajax("POST", "/waybillInsurance/generate/electronicPolicy/{id}", {}, {});
    }

    // list;
    public static listUsingPOST_5(): Promise<any> {
        return ajax("POST", "/waybillInsurance/list", {}, {});
    }

    // save;
    public static saveUsingPOST_6(): Promise<any> {
        return ajax("POST", "/waybillInsurance/save", {}, {});
    }

    // get;
    public static getUsingGET_1(): Promise<any> {
        return ajax("GET", "/waybillInsurance/{id}", {}, {});
    }
}
