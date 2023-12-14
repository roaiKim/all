import { PageTableRequest, PageTableResponse } from "@api/AdvancedTableService";
import { ajax } from "@http";
import { WaybillService$addition$response } from "./type";

export class WaybillService {
    /**
     * @description 页面表格 pageTable 最好命名统一
     * @param request 高级查询参数
     * @returns 高级查询返回值
     */
    static pageTable(request: PageTableRequest): Promise<PageTableResponse<WaybillService$addition$response>> {
        return ajax("POST", `/api/common/transportLimitation/advanced-page`, request);
    }

    /**
     * @description 页面数据详情 addition 最好命名统一
     * @param id string
     * @returns 详情
     */
    static addition(id: string): Promise<WaybillService$addition$response> {
        return ajax("GET", `/api/common/transportLimitation/detail/${id}`);
    }
}
