import { async } from "@core";
import { PageLimitResponse } from "type";
import { ModuleStatement } from "utils/function/loadComponent";

export interface DataDictionaryRecords {
    id: string;
    code: string;
    text: string;
    content: string;
    isJson: number;
    type: string;
}

export interface SubTree {
    code: string;
    id: string;
    type: string;
    text: string;
}

export interface State {
    records: DataDictionaryRecords | null;
    subTrees: Record<string, SubTree[]>;
}

export interface TreeContent {
    content: string;
}

export type SubTreeText = Pick<DataDictionaryRecords, "code" | "text">;

export const statement: ModuleStatement = {
    path: "/dataDictionary",
    title: "DataDictionary",
    order: 4,
    component: async(() => import(/* webpackChunkName: "dataDictionary" */ "./index"), "MainComponent"),
};
