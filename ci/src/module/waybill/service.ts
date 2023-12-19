import { PageTableRequest, PageTableResponse } from "@api/AdvancedTableService";
import { ajax } from "@http";
import { customer } from "utils/decorator/columns-service";
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

export class WaybillColumns {
    @customer("线路编号", 160)
    static carryNumber() {}

    @customer("运输方式", 110)
    static transportMethodName() {}

    @customer("运输模式", 110)
    static businessMethodName() {}

    @customer("路线状态", 110)
    static activeStatus() {}
}
