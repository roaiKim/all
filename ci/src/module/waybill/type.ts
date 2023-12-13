import { async } from "@core";
import { AdditionMessage } from "type";
import { AdvancedTableSource } from "type/api.type";

export const moduleName = "waybill";

export interface State extends AdditionMessage<boolean> {
    table: AdvancedTableSource<any>;
}

export const MainComponent = async(() => import(/* webpackChunkName: "waybill" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "s/waybill",
    title: "运单管理",
    order: 1,
    component: MainComponent,
};
