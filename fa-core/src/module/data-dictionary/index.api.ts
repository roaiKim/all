import { ajax } from "@core";
import { PageLimitResponse } from "type";
import { DataDictionaryRecords } from "./type";

export class Service {
    static get(): Promise<PageLimitResponse<DataDictionaryRecords[]>> {
        return ajax("GET", "/api/dictionary/list");
    }
}
