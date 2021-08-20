import {StowageRouteConfig} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouteConfigAJAXService {
    /**
     * @description 删除运单路由配置
     * @returns string
     */
    public static deleteUsingPOST_5(): Promise<string> {
        return ajax("POST", "/stowageRouteConfig/delete/{id}", {}, {});
    }

    /**
     * @description findByStowageId
     * @returns StowageRouteConfig[]
     */
    public static findByStowageIdUsingGET(): Promise<StowageRouteConfig[]> {
        return ajax("GET", "/stowageRouteConfig/findByStowageId/{stowageId}", {}, {});
    }

    /**
     * @description 根据ID获取运单路由配置
     * @returns StowageRouteConfig
     */
    public static getUsingGET(): Promise<StowageRouteConfig> {
        return ajax("GET", "/stowageRouteConfig/get/{id}", {}, {});
    }

    /**
     * @description 获取运单路由配置列表
     * @returns StowageRouteConfig[]
     */
    public static listUsingGET(): Promise<StowageRouteConfig[]> {
        return ajax("GET", "/stowageRouteConfig/list", {}, {});
    }

    /**
     * @description 新增运单路由配置
     * @returns number
     */
    public static saveUsingPOST_4(): Promise<number> {
        return ajax("POST", "/stowageRouteConfig/save", {}, {});
    }

    /**
     * @description 修改运单路由配置
     * @returns string
     */
    public static updateUsingPOST_2(): Promise<string> {
        return ajax("POST", "/stowageRouteConfig/update/{id}", {}, {});
    }
}
