import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillAJAXService {
    /**
     * @description 删除
     * @returns object
     */
    public static deleteUsingPOST_6(): Promise<object> {
        return ajax("POST", "/waybill/delete", {}, {});
    }

    /**
     * @description 列表
     * @returns object
     */
    public static getListUsingPOST(): Promise<object> {
        return ajax("POST", "/waybill/list", {}, {});
    }

    /**
     * @description 上报
     * @returns object
     */
    public static reportUsingGET(): Promise<object> {
        return ajax("GET", "/waybill/report/{id}", {}, {});
    }

    /**
     * @description 保存
     * @returns object
     */
    public static saveUsingPOST_5(): Promise<object> {
        return ajax("POST", "/waybill/save", {}, {});
    }

    /**
     * @description 获取明细
     * @returns object
     */
    public static getOneUsingGET_1(): Promise<object> {
        return ajax("GET", "/waybill/{id}", {}, {});
    }
}
