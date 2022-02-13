import { ajax } from "@core";
import { DataDictionaryRecords, SubTreeText, TreeContent } from "./type";

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

    static addSubTree(type: string, request: SubTreeText): Promise<DataDictionaryRecords> {
        return ajax("POST", "/api/dictionary/add/:type", { type }, request);
    }

    static getSubTree(type: string): Promise<DataDictionaryRecords[]> {
        return ajax("GET", "/api/dictionary/get/:type", { type });
    }
}
