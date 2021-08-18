import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageRouteConfigAJAXService {
    // 删除运单路由配置;
    public static deleteUsingPOST_5(): Promise<any> {
        return ajax("POST", "/stowageRouteConfig/delete/{id}", {}, {});
    }

    // findByStowageId;
    public static findByStowageIdUsingGET(): Promise<any> {
        return ajax("GET", "/stowageRouteConfig/findByStowageId/{stowageId}", {}, {});
    }

    // 根据ID获取运单路由配置;
    public static getUsingGET(): Promise<any> {
        return ajax("GET", "/stowageRouteConfig/get/{id}", {}, {});
    }

    // 获取运单路由配置列表;
    public static listUsingGET(): Promise<any> {
        return ajax("GET", "/stowageRouteConfig/list", {}, {});
    }

    // 新增运单路由配置;
    public static saveUsingPOST_4(): Promise<any> {
        return ajax("POST", "/stowageRouteConfig/save", {}, {});
    }

    // 修改运单路由配置;
    public static updateUsingPOST_2(): Promise<any> {
        return ajax("POST", "/stowageRouteConfig/update/{id}", {}, {});
    }
}
