import { ajax } from "network";
import { CompanyInfoResponse } from "type";

export class MainService {
    static getCompanyInfo(): Promise<CompanyInfoResponse> {
        return ajax("GET", "/api/admin/company/info");
    }

    static getMeuns(): Promise<any> {
        // return ajax("GET", "/api/admin/company/info");
        return require("../JSON/meuns.json");
    }
}
