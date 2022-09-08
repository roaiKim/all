import { ajax } from "network";

export class TableService {
    static title(moduleName: string): Promise<TableServicResponse> {
        const request = { conditionBodies: [{ conditions: [{ property: "commaListConfigData.code", values: [moduleName], type: "EQUAL" }] }] };
        return ajax("POST", "/api/common/comma-list-config/advanced-unique-get", {}, request);
    }
}

export interface TableServicResponse {
    code: string;
    commaListConfigData: CommaListConfigData[];
    id: string;
    sourceConfigData: string;
    title: string;
    url: string;
    userId: string;
}

interface CommaListConfigData {
    id: string;
    code: string;
    visible: boolean;
    width: number;
    export: boolean;
    title: string;
    type: number;
    propKey: string;
    idx: number;
    config: string;
    sort: true;
    userId: string;
}
