import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageCenterAJAXService {
    // 任务转派;
    public static assignOrderRouterSegmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/assign", {}, {});
    }

    // 任务转派;
    public static updateOrderRouterSegmentCarrierUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/carrier/update", {}, {});
    }

    // 获取报关该配载段相关配载段;
    public static queryCustomsOrderRouterSegmentUsingGET(): Promise<any> {
        return ajax("GET", "/stowageCenter/customs/{id}", {}, {});
    }

    // 分页查询订单路由配载段;
    public static queryOrderRouterSegmentByPageUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/list", {}, {});
    }

    // 订单配载拆分查询;
    public static queryOrderRouterSegmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/segment/query/{id}", {}, {});
    }

    // 订单配载拆分;
    public static splitOrderRouterSegmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/split/{id}", {}, {});
    }

    // 订单中转拆分;
    public static transferSplitOrderRouterSegmentUsingPOST(): Promise<any> {
        return ajax("POST", "/stowageCenter/transferSplit", {}, {});
    }
}
