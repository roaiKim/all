import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class WaybillAJAXService {
    // 删除;
    public static deleteUsingPOST_6(): Promise<any> {
        return ajax("POST", "/waybill/delete", {}, {});
    }

    // 列表;
    public static getListUsingPOST(): Promise<any> {
        return ajax("POST", "/waybill/list", {}, {});
    }

    // 上报;
    public static reportUsingGET(): Promise<any> {
        return ajax("GET", "/waybill/report/{id}", {}, {});
    }

    // 保存;
    public static saveUsingPOST_5(): Promise<any> {
        return ajax("POST", "/waybill/save", {}, {});
    }

    // 获取明细;
    public static getOneUsingGET_1(): Promise<any> {
        return ajax("GET", "/waybill/{id}", {}, {});
    }
}
