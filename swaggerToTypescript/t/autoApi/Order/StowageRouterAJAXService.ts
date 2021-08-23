import {StowageRouterStationSegmentVo, StowageRouterDTO, StowageRouterPageListVo, StowageRouterQueryVo, StowageRouterSegmentDTO} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouterAJAXService {
    /**
     * @description 添加配载路由
     * @param in body {StowageRouterDTO} stowageRouter
     * @returns StowageRouterStationSegmentVo
     */
    public static addStowageRouterUsingPOST(stowageRouter: StowageRouterDTO): Promise<StowageRouterStationSegmentVo> {
        return ajax("POST", `/stowage-router/add`, {}, {stowageRouter});
    }

    /**
     * @description 批量删除配载路由
     * @param in body {number[]} ids
     * @returns object
     */
    public static deleteStowageRouterUsingPOST(ids: number[]): Promise<object> {
        return ajax("POST", `/stowage-router/delete`, {}, {ids});
    }

    /**
     * @description 分页查询配载路由
     * @param in body {StowageRouterQueryVo} stowageRouterQueryVo
     * @returns StowageRouterPageListVo[]
     */
    public static queryStowageRouterByPageUsingPOST(stowageRouterQueryVo: StowageRouterQueryVo): Promise<StowageRouterPageListVo[]> {
        return ajax("POST", `/stowage-router/list`, {}, {stowageRouterQueryVo});
    }

    /**
     * @description 查询某个配载路由全部信息
     * @param in query {number} routerId
     * @returns object
     */
    public static queryStowageRouterByIdUsingPOST(routerId: number): Promise<object> {
        return ajax("POST", `/stowage-router/query?routerId=${routerId}`, {}, {});
    }

    /**
     * @description 更新配载路由段信息
     * @param in body {StowageRouterSegmentDTO} stowageRouterSegmentDTO
     * @returns object
     */
    public static updateStowageRouterSegmentUsingPOST(stowageRouterSegmentDTO: StowageRouterSegmentDTO): Promise<object> {
        return ajax("POST", `/stowage-router/segment/update`, {}, {stowageRouterSegmentDTO});
    }

    /**
     * @description 更新某个配载路由全部信息
     * @param in body {StowageRouterDTO} stowageRouter
     * @returns object
     */
    public static updateStowageRouterUsingPOST(stowageRouter: StowageRouterDTO): Promise<object> {
        return ajax("POST", `/stowage-router/update`, {}, {stowageRouter});
    }
}
