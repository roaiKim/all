import { ajax } from "@http";

export interface LoginServiceLoginRequest {
    // grant_type: string;
    username: string;
    password: string;
}

export interface UserExtraInfo {
    empId: string | null;
    "Comma-Tenant-Ids": string[];
    clientId: string | null;
    accountName: string | null;
    partnerName: string;
    roleCodes: string[] | null;
    nameEn: string;
    whetherNewUser: boolean;
    subAccountFlag: boolean | null;
    "Comma-Tenant-Id": string;
    "Tenant-Driver-Ids": Record<string, number>;
    projectDataPermission: string;
    partnerId: string;
    userType: number;
}

export interface LoginServiceLoginResponse {
    sub: string;
    driver_session_expires_at: number;
    clientId: string;
    iss: string;
    token_type: string;
    access_token: string;
    refresh_token: string;
    aud: string[];
    license: string;
    new_user: boolean;
    nbf: number;
    full_name: string;
    user_id: string;
    extra: UserExtraInfo;
    exp: number;
    dept_id: string;
    expires_in: number;
    iat: number;
    jti: string;
    username: string;
}

export class LoginService {
    static login(request: LoginServiceLoginRequest): Promise<LoginServiceLoginResponse> {
        return ajax("POST", "/auth/oauth2/token?grant_type=social", request);
    }

    static logout(): Promise<void> {
        return ajax("DELETE", "/auth/token/logout", {}, "FORM");
    }

    static getAccount() {
        return ajax("GET", "/admin/account/dataPermissionTree/getByUserId", { type: "wx" });
    }
}
