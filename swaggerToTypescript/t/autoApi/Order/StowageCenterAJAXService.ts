import {OrderRouterSegmentPageListVo, OrderRouterSegmentSplitVo} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageCenterAJAXService {
    /**
     * @description 任务转派
     * @returns object
     */
    public static assignOrderRouterSegmentUsingPOST(): Promise<object> {
        return ajax("POST", "/stowageCenter/assign", {}, {});
    }

    /**
     * @description 任务转派
     * @returns object
     */
    public static updateOrderRouterSegmentCarrierUsingPOST(): Promise<object> {
        return ajax("POST", "/stowageCenter/carrier/update", {}, {});
    }

    /**
     * @description 获取报关该配载段相关配载段
     * @returns OrderRouterSegmentPageListVo[]
     */
    public static queryCustomsOrderRouterSegmentUsingGET(): Promise<OrderRouterSegmentPageListVo[]> {
        return ajax("GET", "/stowageCenter/customs/{id}", {}, {});
    }

    /**
     * @description 分页查询订单路由配载段
     * @returns OrderRouterSegmentPageListVo[]
     */
    public static queryOrderRouterSegmentByPageUsingPOST(): Promise<OrderRouterSegmentPageListVo[]> {
        return ajax("POST", "/stowageCenter/list", {}, {});
    }

    /**
     * @description 订单配载拆分查询
     * @returns OrderRouterSegmentSplitVo
     */
    public static queryOrderRouterSegmentUsingPOST(): Promise<OrderRouterSegmentSplitVo> {
        return ajax("POST", "/stowageCenter/segment/query/{id}", {}, {});
    }

    /**
     * @description 订单配载拆分
     * @returns object
     */
    public static splitOrderRouterSegmentUsingPOST(): Promise<object> {
        return ajax("POST", "/stowageCenter/split/{id}", {}, {});
    }

    /**
     * @description 订单中转拆分
     * @returns object
     */
    public static transferSplitOrderRouterSegmentUsingPOST(): Promise<object> {
        return ajax("POST", "/stowageCenter/transferSplit", {}, {});
    }
}
