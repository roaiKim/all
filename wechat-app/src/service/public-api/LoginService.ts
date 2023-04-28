import { Method, ajax } from "@http";

export interface LoginServiceLoginRequest {
    grant_type: string;
    username: string;
    password: string;
}

export interface LoginServiceLoginResponse {
    access_token: string;
    account_name: string;
    client_id: 0;
    dept_id: string;
    expires_in: number;
    license: string;
    refresh_token: string;
    role_codes: string[];
    scope: string;
    sub_account_flag: number;
    system_user_type: string;
    token_type: string;
    user_id: string;
    username: string;
}

export class LoginService {
    @Method("POST")
    static login(request: LoginServiceLoginRequest): Promise<LoginServiceLoginResponse> {
        return ajax.call(this.login, "POST", "/auth/oauth/token", {}, request, "FORM", {});
    }

    static logout(): Promise<void> {
        return ajax.call(this.logout, "DELETE", "/auth/token/logout", {}, {}, "FORM");
    }

    static logoin(): Promise<void> {
        return ajax.call(this.logoin, "DELETE", "/auth/token/logout", {}, {}, "FORM");
    }
}

// export class LogoutService {
//     @Method("POST")
//     static login(request: LoginServiceLoginRequest): Promise<LoginServiceLoginResponse> {
//         return ajax.call(this.login, "POST", "/auth/oauth/token", {}, request, "FORM", {});
//     }

//     @Method("POST")
//     static logout(): Promise<void> {
//         console.log("exception logout");
//         return Promise.resolve();
//     }
// }
