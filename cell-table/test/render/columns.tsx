import { CellTableColumn } from "components/type";
import { CUSTOMER, DATE, OPTION, STRING, WIDTH } from "./columns-service";

export const ACTIVE_STATUS = [
    { key: 0, value: "禁用", style: { color: "#FF2525" } },
    { key: 1, value: "启用", style: { color: "#27B148" } },
];

export const BOOLEAN_STATUS = [
    { key: 0, value: "是", style: { color: "#FF2525" } },
    { key: 1, value: "否", style: { color: "#27B148" } },
];

export const cellTableColumn: CellTableColumn[] = [
    ["调拨单号", "transferNumber"],
    ["状态", "reviewStatus"],
    ["服务类型", "transportMethodName"],
    ["时效", "aging"],
    ["冷云项目", "projectName"],
    ["调出站点", "outSiteName"],
    ["调出时间", "outTime"],
    ["调入站点", "inSiteName"],
    ["调入时间", "inTime"],
    ["出港时间", "departureTime"],
    ["出港人", "departureUser"],
    ["要求调拨日期", "requireTransferTime"],
    ["创建人", "createUserName"],
    ["创建时间", "createTime"],
    ["备注", "remark"],
];

export class WaybillColumns {
    @STRING("调拨单号")
    static transferNumber() {}

    @OPTION("状态", ACTIVE_STATUS)
    static reviewStatus() {}

    @STRING("服务类型")
    static transportMethodName() {}

    @STRING("时效")
    static aging() {}

    @STRING("冷云项目")
    static projectName() {}

    @STRING("调出站点")
    static outSiteName() {}

    @DATE("调出时间")
    static outTime() {}

    @STRING("调入站点")
    static inSiteName() {}

    @DATE("调入时间")
    static inTime() {}

    @DATE("出港时间")
    static departureTime() {}

    @STRING("出港人")
    static departureUser() {}

    @DATE("要求调拨日期")
    static requireTransferTime() {}

    @STRING("创建人")
    static createUserName() {}

    @DATE("创建时间")
    static createTime() {}

    @STRING("备注")
    static remark() {}
}
