import { async } from "@core";
import { AdvancedTableSource } from "type/api.type";

export const moduleName = "home";

export interface State {
    table: AdvancedTableSource<any>;
}

export const MainComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/:id(home)?",
    title: "Home",
    order: 1,
    component: MainComponent,
};

export const STATUS_TAG = [
    { key: 1, value: "待提交", color: "#3291f8" },
    { key: 2, value: "已确认", color: "#801dae" },
    { key: 3, value: "运输中", color: "#ffa400" },
    { key: 4, value: "待签收", color: "#2edfa3" },
    { key: 5, value: "已签收", color: "#52C41A" },
    { key: 6, value: "已取消", color: "#ff3300" },
    { key: 7, value: "已提交", color: "#ca6924" },
    { key: 8, value: "待确认", color: "#a98175" },
];
