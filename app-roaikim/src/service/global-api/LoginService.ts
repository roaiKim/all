import { stringify } from "querystring";
import type { AuthTokenRequest, AuthTokenResponse } from "type/api.type";
import { ajax } from "@http";

interface LoginService$Login$Request {
    name: string;
}

export class LoginService {
    static login(request: AuthTokenRequest): Promise<AuthTokenResponse> {
        const requestString = stringify(request as any);
        return ajax("POST", `/api/auth/oauth/token?${requestString}`, requestString, "FORM");
    }

    static logout(): Promise<AuthTokenResponse> {
        return ajax("DELETE", "/api/auth/token/logout", null, null);
    }
}
