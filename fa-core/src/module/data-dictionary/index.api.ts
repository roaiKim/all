import { ajax } from "@core";
import { DataDictionaryRecords, TreeContent } from "./type";

export class DictionaryService {
    static get(): Promise<DataDictionaryRecords> {
        return ajax("GET", "/api/dictionary/get/tree");
    }

    static createTree(request: TreeContent): Promise<DataDictionaryRecords> {
        return ajax("POST", "/api/dictionary/create/tree", {}, request);
    }

    static updateTree(request: TreeContent): Promise<DataDictionaryRecords> {
        return ajax("POST", "/api/dictionary/update/tree", {}, request);
    }
}
