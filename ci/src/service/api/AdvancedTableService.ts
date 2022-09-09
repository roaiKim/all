import { ajax } from "network";

export class AdvancedTableService {
    static title(moduleName: string): Promise<TableServicResponse> {
        const request = { conditionBodies: [{ conditions: [{ property: "commaListConfigData.code", values: [moduleName], type: "EQUAL" }] }] };
        return ajax("POST", "/api/common/comma-list-config/advanced-unique-get", {}, request);
    }

    static table(request: AdvancedTableRequest): Promise<AdvancedTableResponse<any>> {
        return ajax("POST", "/api/common/project/advanced-page", {}, request);
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

export interface CommaListConfigData {
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

export interface Orders {
    orderBy: string;
    ascending: boolean;
}

export interface AdvancedTableRequest {
    offset?: number;
    limit?: number;
    pageNo: number;
    pageSize: number;
    selectColumns?: string[];
    conditionBodies?: Record<string, any>[];
    orders?: Orders[];
}

export interface AdvancedTableResponse<T> {
    pageIndex: number;
    pageSize: number;
    total: string;
    data: T[];
}
