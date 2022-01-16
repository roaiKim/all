import { async } from "@core";
import { PageLimitResponse } from "type";
import { ModuleStatement } from "utils/function/loadComponent";

export interface DataDictionaryRecords {
    id: string;
    code: string;
    text: string;
    content: string;
    isJson: number;
    type: number;
}

export interface State {
    records: DataDictionaryRecords | null;
}

export const statement: ModuleStatement = {
    path: "/dataDictionary",
    title: "DataDictionary",
    order: 4,
    component: async(() => import(/* webpackChunkName: "dataDictionary" */ "./index"), "MainComponent"),
};

export interface TreeContent {
    content: string;
}
