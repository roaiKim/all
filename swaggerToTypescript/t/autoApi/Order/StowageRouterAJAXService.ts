import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouterAJAXService {
    // 添加配载路由;
    public static addStowageRouterUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/add", {}, {});
    }

    // 批量删除配载路由;
    public static deleteStowageRouterUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/delete", {}, {});
    }

    // 分页查询配载路由;
    public static queryStowageRouterByPageUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/list", {}, {});
    }

    // 查询某个配载路由全部信息;
    public static queryStowageRouterByIdUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/query", {}, {});
    }

    // 更新配载路由段信息;
    public static updateStowageRouterSegmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/segment/update", {}, {});
    }

    // 更新某个配载路由全部信息;
    public static updateStowageRouterUsingPOST(): Promise<any> {
        return ajax("POST", "/stowage-router/update", {}, {});
    }
}
