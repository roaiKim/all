import {StowageRouterStationSegmentVo, StowageRouterPageListVo} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouterAJAXService {
    /**
     * @description 添加配载路由
     * @returns StowageRouterStationSegmentVo
     */
    public static addStowageRouterUsingPOST(): Promise<StowageRouterStationSegmentVo> {
        return ajax("POST", "/stowage-router/add", {}, {});
    }

    /**
     * @description 批量删除配载路由
     * @returns object
     */
    public static deleteStowageRouterUsingPOST(): Promise<object> {
        return ajax("POST", "/stowage-router/delete", {}, {});
    }

    /**
     * @description 分页查询配载路由
     * @returns StowageRouterPageListVo[]
     */
    public static queryStowageRouterByPageUsingPOST(): Promise<StowageRouterPageListVo[]> {
        return ajax("POST", "/stowage-router/list", {}, {});
    }

    /**
     * @description 查询某个配载路由全部信息
     * @returns object
     */
    public static queryStowageRouterByIdUsingPOST(): Promise<object> {
        return ajax("POST", "/stowage-router/query", {}, {});
    }

    /**
     * @description 更新配载路由段信息
     * @returns object
     */
    public static updateStowageRouterSegmentUsingPOST(): Promise<object> {
        return ajax("POST", "/stowage-router/segment/update", {}, {});
    }

    /**
     * @description 更新某个配载路由全部信息
     * @returns object
     */
    public static updateStowageRouterUsingPOST(): Promise<object> {
        return ajax("POST", "/stowage-router/update", {}, {});
    }
}
