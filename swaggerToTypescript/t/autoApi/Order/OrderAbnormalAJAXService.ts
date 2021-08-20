import {OrderAbnormal, Page} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAbnormalAJAXService {
    /**
     * @description 添加异常
     * @returns string
     */
    public static saveUsingPOST(): Promise<string> {
        return ajax("POST", "/orderAbnormal/add", {}, {});
    }

    /**
     * @description 删除异常
     * @returns string
     */
    public static deleteUsingPOST_1(): Promise<string> {
        return ajax("POST", "/orderAbnormal/delete", {}, {});
    }

    /**
     * @description 处理异常
     * @returns string
     */
    public static updateUsingPOST(): Promise<string> {
        return ajax("POST", "/orderAbnormal/edit/{id}", {}, {});
    }

    /**
     * @description 获取单个订单异常
     * @returns OrderAbnormal
     */
    public static getOneUsingGET(): Promise<OrderAbnormal> {
        return ajax("GET", "/orderAbnormal/getOne/{id}", {}, {});
    }

    /**
     * @description 列表
     * @returns Page<OrderAbnormal>
     */
    public static listUsingPOST_1(): Promise<Page<OrderAbnormal>> {
        return ajax("POST", "/orderAbnormal/list", {}, {});
    }

    /**
     * @description 获取详情
     * @returns OrderAbnormal
     */
    public static saveUsingGET(): Promise<OrderAbnormal> {
        return ajax("GET", "/orderAbnormal/{id}", {}, {});
    }
}
