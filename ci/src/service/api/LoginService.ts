import { ajax } from "network";
import { stringify } from "querystring";
import { AuthTokenRequest, AuthTokenResponse } from "type";
import { ContentType } from "utils/function/staticEnvs";

export class LoginService {
    static login(request: AuthTokenRequest): Promise<AuthTokenResponse> {
        const requestString = stringify(request as any);
        return ajax("POST", `/api/auth/oauth/token?${requestString}` + requestString, {}, requestString, { contentType: ContentType.FORM });
    }

    static logout(): Promise<AuthTokenResponse> {
        return ajax("DELETE", "/api/auth/token/logout", {}, {});
    }
}
