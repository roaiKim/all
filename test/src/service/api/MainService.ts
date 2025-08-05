import { CompanyInfoResponse } from "type/api.type";
import { ajax } from "@http";

export class MainService {
    static getCompanyInfo(): Promise<CompanyInfoResponse> {
        return ajax("GET", "/api/admin/company/info");
    }

    static getMeuns(): Promise<any> {
        // return ajax("GET", "/api/admin/company/info");
        return require("../JSON/meuns.json");
    }
}
