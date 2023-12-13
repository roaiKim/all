import { PageTableRequest, PageTableResponse } from "@api/AdvancedTableService";
import { ajax } from "@http";

export class WaybillService {
    static pageTable(request: PageTableRequest): Promise<PageTableResponse<any>> {
        return ajax("POST", `/api/common/transportLimitation/advanced-page`, request);
    }
}
