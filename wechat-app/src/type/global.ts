export interface AdvancedPageResponse<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    total: string;
}
