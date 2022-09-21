import { AdvancedTableResponse, AdvancedTableService } from "@api/AdvancedTableService";

export interface PageLimitResponse<T> {
    list: T[];
    totalRecord: number;
}

export interface PageDataLimitResponse<T = Record<string, any>> {
    data: T[];
    total: number;
}

export interface PageRecordsLimitResponse<T = Record<string, any>> {
    records: T[];
    total: number;
}

/* MainService */
export interface CompanyInfoResponse {
    amapkey: string;
    bmapkey: string;
    favicon: string;
    headerLogo: string;
    icp: string;
    logo: string;
    platformName: string;
}

/* LoginService */

export interface AuthTokenRequest {
    grant_type?: string;
    password?: string;
    imgCode?: string;
    username?: string;
    randomStr?: string;
    code?: string;
}

export interface AuthTokenResponse {
    access_token: string;
    dept_id: string;
    expires_in: number;
    license: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    user_id: number;
    username: string;
    new_user: boolean;
}

export interface OrderServicePaymentRequest {
    id: string;
    tradeType: string;
}

export interface AdvancedTableSource {
    table: {
        source: AdvancedTableResponse<any>;
        sourceLoading: boolean;
        sourceLoadError: boolean;
        columns: any[];
        columnLoading: boolean;
        columnLoadError: boolean;
    };
}
