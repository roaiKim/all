import { async } from "@core";
import { AdditionMessage } from "type";
import { AdvancedTableSource, CodeNameJSON, NumberToTrueOrFalse, ResponseDefaultCreatorAddition } from "type/api.type";

export const moduleName = "waybill";

export interface State {
    table: AdvancedTableSource<WaybillService$addition$response>;
    addition: AdditionMessage<WaybillService$addition$response>;
}

export const MainComponent = async(() => import(/* webpackChunkName: "waybill" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "s/transport-routes",
    title: "运单管理",
    order: 1,
    component: MainComponent,
};

export interface WaybillService$addition$response extends ResponseDefaultCreatorAddition {
    id: string;
    departureProvince: string;
    departureCity: string;
    transportMethodCode: "HK";
    transportMethodName: "航空";
    isAllowDryice: NumberToTrueOrFalse;
    isAllowLiquidNitrogen: NumberToTrueOrFalse;
    isDg: NumberToTrueOrFalse;
    isPalletBox: NumberToTrueOrFalse;
    isAllowBattery: NumberToTrueOrFalse;
    batteryType: CodeNameJSON[];
    remark: string;
    activeStatus: NumberToTrueOrFalse;
    duplicateHash: string;
}
