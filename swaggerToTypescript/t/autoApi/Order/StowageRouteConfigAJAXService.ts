import {StowageRouteConfig} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouteConfigAJAXService {
    /**
     * @description 删除运单路由配置
     * @param in path {number} id
     * @returns string
     */
    public static deleteUsingPOST_5(id: number): Promise<string> {
        return ajax("POST", `/stowageRouteConfig/delete/{id}`, {id}, {});
    }

    /**
     * @description findByStowageId
     * @param in path {number} stowageId
     * @returns StowageRouteConfig[]
     */
    public static findByStowageIdUsingGET(stowageId: number): Promise<StowageRouteConfig[]> {
        return ajax("GET", `/stowageRouteConfig/findByStowageId/{stowageId}`, {stowageId}, {});
    }

    /**
     * @description 根据ID获取运单路由配置
     * @param in path {number} id
     * @returns StowageRouteConfig
     */
    public static getUsingGET(id: number): Promise<StowageRouteConfig> {
        return ajax("GET", `/stowageRouteConfig/get/{id}`, {id}, {});
    }

    /**
     * @description 获取运单路由配置列表
     * @param in query {number} orderId
     * @param in query {number} stowageId
     * @returns StowageRouteConfig[]
     */
    public static listUsingGET(orderId?: number, stowageId?: number): Promise<StowageRouteConfig[]> {
        return ajax("GET", `/stowageRouteConfig/list?orderId=${orderId}&stowageId=${stowageId}`, {}, {});
    }

    /**
     * @description 新增运单路由配置
     * @param in body {StowageRouteConfig} stowageRouteConfig
     * @returns number
     */
    public static saveUsingPOST_4(stowageRouteConfig: StowageRouteConfig): Promise<number> {
        return ajax("POST", `/stowageRouteConfig/save`, {}, {stowageRouteConfig});
    }

    /**
     * @description 修改运单路由配置
     * @param in path {number} id
     * @param in body {StowageRouteConfig} stowageRouteConfig
     * @returns string
     */
    public static updateUsingPOST_2(id: number, stowageRouteConfig: StowageRouteConfig): Promise<string> {
        return ajax("POST", `/stowageRouteConfig/update/{id}`, {id}, {stowageRouteConfig});
    }
}
