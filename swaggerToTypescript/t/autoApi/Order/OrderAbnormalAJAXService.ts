import {OrderAbnormalVO, OrderAbnormal, Page, PublicPagination} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class OrderAbnormalAJAXService {
    /**
     * @description 添加异常
     * @param in body {OrderAbnormalVO} orderAbnormalVO
     * @returns string
     */
    public static saveUsingPOST(orderAbnormalVO: OrderAbnormalVO): Promise<string> {
        return ajax("POST", "/orderAbnormal/add", {}, {});
    }

    /**
     * @description 删除异常
     * @param in body {number[]} ids
     * @returns string
     */
    public static deleteUsingPOST_1(ids: number[]): Promise<string> {
        return ajax("POST", "/orderAbnormal/delete", {}, {});
    }

    /**
     * @description 处理异常
     * @param in path{number} id
     * @param in body {OrderAbnormalVO} orderAbnormalVO
     * @returns string
     */
    public static updateUsingPOST(id: number, orderAbnormalVO: OrderAbnormalVO): Promise<string> {
        return ajax("POST", "/orderAbnormal/edit/{id}", {}, {});
    }

    /**
     * @description 获取单个订单异常
     * @param in path{number} id
     * @returns OrderAbnormal
     */
    public static getOneUsingGET(id: number): Promise<OrderAbnormal> {
        return ajax("GET", "/orderAbnormal/getOne/{id}", {}, {});
    }

    /**
     * @description 列表
     * @param in body {PublicPagination} condition
     * @returns Page<OrderAbnormal>
     */
    public static listUsingPOST_1(condition: PublicPagination): Promise<Page<OrderAbnormal>> {
        return ajax("POST", "/orderAbnormal/list", {}, {});
    }

    /**
     * @description 获取详情
     * @param in path{number} id
     * @returns OrderAbnormal
     */
    public static saveUsingGET(id: number): Promise<OrderAbnormal> {
        return ajax("GET", "/orderAbnormal/{id}", {}, {});
    }
}
