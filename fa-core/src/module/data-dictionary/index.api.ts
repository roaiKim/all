import { ajax } from "@core";
import { PageLimitResponse } from "type";
import { DataDictionaryRecords } from "./type";

export class Service {
    static get(): Promise<PageLimitResponse<DataDictionaryRecords>> {
        return ajax("GET", "/api/dictionary/get/tree");
    }

    static createTree(request): Promise<PageLimitResponse<DataDictionaryRecords>> {
        return ajax("POST", "/api/dictionary/create/tree", {}, request);
    }
}
