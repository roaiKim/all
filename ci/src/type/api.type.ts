import { AdvancedTableService, PageTableResponse } from "@api/AdvancedTableService";

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

export interface AdvancedTableSource<T> {
    source: PageTableResponse<T>;
    sourceLoadError: boolean;
}

/**
 * 默认的 创建者信息
 */
export interface ResponseDefaultCreatorAddition {
    createUserName?: string;
    createUserId?: string;
    createTime?: number;
    updateTime?: number;
    updateUserId?: string;
    updateUserName?: string;
}

/**
 * code name JSON 信息
 */
export interface CodeNameJSON {
    code: string;
    name: string;
}

export type NumberToTrueOrFalse = 0 | 1;
