import { ajax } from "@http";

export class ReportService {
    static page(): Promise<ReportService$page$response> {
        return ajax("POST", "/api/report/reportCard/h5", { pageNo: 1, pageSize: 9999 });
    }
}

export interface ReportService$page$response {
    records: object[];
}
