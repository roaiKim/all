import { ACTIVE_STATUS, BOOLEAN_STATUS } from "type";
import { PageTableRequest, PageTableResponse } from "@api/AdvancedTableService";
import { ajax } from "@http";
import { ViewType } from "http/config";
import { CUSTOMER, DATE, OPTION, STRING, WIDTH } from "utils/decorator/columns-service";
import { Api, GlobalHold, HttpContentType, Method, StaticAssemble, TestDecorator, TestPOSTDecorator } from "utils/decorator/test";
import { WaybillService$addition$response } from "./type";

class RequestApi {
    @TestDecorator()
    static fetch(...args) {
        console.log("----args", this);
        console.log("--RequestApi--tt", args);
    }
}

export class WaybillService extends RequestApi {
    /**
     * @description 页面表格 pageTable 最好命名统一
     * @param request 高级查询参数
     * @returns 高级查询返回值
     */
    // @TestPOSTDecorator()
    // @TestDecorator()
    static pageTables(request: PageTableRequest): Promise<PageTableResponse<WaybillService$addition$response>> {
        return ajax("POST", `/api/tms/transferInfo/advanced-page`, request);
    }

    // @TestPOSTDecorator()
    // @TestDecorator()
    // static pageTable(request: PageTableRequest): any {
    //     this.ajax("POST", `/api/tms/transferInfo/advanced-page`, request);
    // }

    @GlobalHold
    @HttpContentType("JSON")
    @Method("POST", "获取表格")
    @Api("POST", "获取表格", ViewType.page)
    @TestDecorator()
    static pageTable(request: PageTableRequest): any {
        console.log("--args-------");
        return ajax("POST", `/api/tms/transferInfo/advanced-page`, request);
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
    @STRING("出港省份")
    static departureProvince() {}

    @STRING("出港城市")
    static departureCity() {}

    @OPTION("状态", ACTIVE_STATUS)
    static activeStatus() {}

    @STRING("运输方式")
    static transportMethodName() {}

    @OPTION("是否允许干冰", BOOLEAN_STATUS)
    static isAllowDryice() {}

    @OPTION("是否允许液氮", BOOLEAN_STATUS)
    static isAllowLiquidNitrogen() {}

    @OPTION("是否危险品", BOOLEAN_STATUS)
    static isDg() {}

    @OPTION("是否允许电池", BOOLEAN_STATUS)
    static isAllowBattery() {}

    @WIDTH(160)
    @CUSTOMER("允许干电池类型")
    static batteryType(values) {
        return <div style={{ color: "#27B148" }}>{values?.map((item) => item.name).join("，")}</div>;
    }

    @OPTION("是否允许托盘箱", BOOLEAN_STATUS)
    static isPalletBox() {}

    @STRING("创建人")
    static createUserName() {}

    @DATE("创建时间")
    static createTime() {}
}
