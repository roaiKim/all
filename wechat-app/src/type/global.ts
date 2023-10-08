export interface AdvancedPageResponse<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    total: string;
}

export interface AdvancedPageRequest {
    conditionBodies: conditionBodies[];
    limit: number;
    offset: number;
    pageNo: number;
    pageSize: number;
}

export interface conditionBodies {
    conditions: Conditions[];
}
export interface Conditions {
    property: string;
    values: any[];
    type: string;
}
