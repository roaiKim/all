import {StowageAbnormalVO, Page, StowageAbnormal, PublicPagination} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAbnormalAJAXService {
    /**
     * @description 添加异常
     * @param in body {StowageAbnormalVO} stowageAbnormalVO
     * @returns string
     */
    public static saveUsingPOST_2(stowageAbnormalVO: StowageAbnormalVO): Promise<string> {
        return ajax("POST", `/stowageAbnormal/add`, {}, {stowageAbnormalVO});
    }

    /**
     * @description 删除异常
     * @param in body {number[]} ids
     * @returns string
     */
    public static deleteUsingPOST_3(ids: number[]): Promise<string> {
        return ajax("POST", `/stowageAbnormal/delete`, {}, {ids});
    }

    /**
     * @description 处理异常
     * @param in path {number} id
     * @param in body {StowageAbnormalVO} stowageAbnormalVO
     * @returns string
     */
    public static updateUsingPOST_1(id: number, stowageAbnormalVO: StowageAbnormalVO): Promise<string> {
        return ajax("POST", `/stowageAbnormal/edit/{id}`, {id}, {stowageAbnormalVO});
    }

    /**
     * @description 列表
     * @param in body {PublicPagination} condition
     * @returns Page<StowageAbnormal>
     */
    public static listUsingPOST_3(condition: PublicPagination): Promise<Page<StowageAbnormal>> {
        return ajax("POST", `/stowageAbnormal/list`, {}, {condition});
    }

    /**
     * @description 获取详情
     * @param in path {number} id
     * @returns StowageAbnormal
     */
    public static saveUsingGET_1(id: number): Promise<StowageAbnormal> {
        return ajax("GET", `/stowageAbnormal/{id}`, {id}, {});
    }
}
