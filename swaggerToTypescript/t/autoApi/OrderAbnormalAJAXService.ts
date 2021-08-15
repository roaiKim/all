import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAbnormalAJAXService {
    // 添加异常;
    public static saveUsingPOST(): Promise<any> {
        return ajax("POST", "/orderAbnormal/add", {}, {});
    }

    // 删除异常;
    public static deleteUsingPOST_1(): Promise<any> {
        return ajax("POST", "/orderAbnormal/delete", {}, {});
    }

    // 处理异常;
    public static updateUsingPOST(): Promise<any> {
        return ajax("POST", "/orderAbnormal/edit/{id}", {}, {});
    }

    // 获取单个订单异常;
    public static getOneUsingGET(): Promise<any> {
        return ajax("GET", "/orderAbnormal/getOne/{id}", {}, {});
    }

    // 列表;
    public static listUsingPOST_1(): Promise<any> {
        return ajax("POST", "/orderAbnormal/list", {}, {});
    }

    // 获取详情;
    public static saveUsingGET(): Promise<any> {
        return ajax("GET", "/orderAbnormal/{id}", {}, {});
    }
}
