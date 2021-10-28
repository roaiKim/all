/* eslint-disable quotes */
import {
    OrderRouterSegmentAssignDTO,
    OrderRouterSegmentCarrierDTO,
    OrderRouterSegmentPageListVo,
    OrderRouterSegmentQueryVo,
    OrderRouterSegmentSplitVo,
    OrderRouterSegmentSplitDTO,
    OrderRouterSegmentTransferSplitDTO,
} from "../orderType";
import { ajax } from "core";

// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageCenterAJAXService {
    /**
     * @description 任务转派
     * @param in body {OrderRouterSegmentAssignDTO} assignDTO
     * @returns object
     */
    public static assignOrderRouterSegmentUsingPOST(assignDTO: OrderRouterSegmentAssignDTO): Promise<object> {
        return ajax("POST", `/stowageCenter/assign`, {}, { assignDTO });
    }

    /**
     * @description 任务转派
     * @param in body {OrderRouterSegmentCarrierDTO} carrierDTO
     * @returns object
     */
    public static updateOrderRouterSegmentCarrierUsingPOST(carrierDTO: OrderRouterSegmentCarrierDTO): Promise<object> {
        return ajax("POST", `/stowageCenter/carrier/update`, {}, { carrierDTO });
    }

    /**
     * @description 获取报关该配载段相关配载段
     * @param in path {number} id
     * @returns OrderRouterSegmentPageListVo[]
     */
    public static queryCustomsOrderRouterSegmentUsingGET(id: number): Promise<OrderRouterSegmentPageListVo[]> {
        return ajax("GET", `/stowageCenter/customs/{id}`, { id }, {});
    }

    /**
     * @description 分页查询订单路由配载段
     * @param in body {OrderRouterSegmentQueryVo} orderRouterSegmentQueryVo
     * @returns OrderRouterSegmentPageListVo[]
     */
    public static queryOrderRouterSegmentByPageUsingPOST(orderRouterSegmentQueryVo: OrderRouterSegmentQueryVo): Promise<OrderRouterSegmentPageListVo[]> {
        return ajax("POST", `/stowageCenter/list`, {}, { orderRouterSegmentQueryVo });
    }

    /**
     * @description 订单配载拆分查询
     * @param in path {number} id
     * @returns OrderRouterSegmentSplitVo
     */
    public static queryOrderRouterSegmentUsingPOST(id: number): Promise<OrderRouterSegmentSplitVo> {
        return ajax("POST", `/stowageCenter/segment/query/{id}`, { id }, {});
    }

    /**
     * @description 订单配载拆分
     * @param in path {number} id
     * @param in body {OrderRouterSegmentSplitDTO[]} splitSegmentDTOs
     * @returns object
     */
    public static splitOrderRouterSegmentUsingPOST(id: number, splitSegmentDTOs: OrderRouterSegmentSplitDTO[]): Promise<object> {
        return ajax("POST", `/stowageCenter/split/{id}`, { id }, { splitSegmentDTOs });
    }

    /**
     * @description 订单中转拆分
     * @param in body {OrderRouterSegmentTransferSplitDTO} transferSplitSegmentDTO
     * @returns object
     */
    public static transferSplitOrderRouterSegmentUsingPOST(transferSplitSegmentDTO: OrderRouterSegmentTransferSplitDTO): Promise<object> {
        return ajax("POST", `/stowageCenter/transferSplit`, {}, { transferSplitSegmentDTO });
    }
}
