import { ajax } from "@core";
import { DataDictionaryRecords } from "./type";

export class Service {
    static get(): Promise<DataDictionaryRecords> {
        return ajax("GET", "/api/dictionary/get/tree");
    }

    static createTree(request): Promise<DataDictionaryRecords> {
        return ajax("POST", "/api/dictionary/create/tree", {}, request);
    }

    static updateTree(request): Promise<DataDictionaryRecords> {
        return ajax("POST", "/api/dictionary/update/tree", {}, request);
    }
}
