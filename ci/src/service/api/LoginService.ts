import { ajax } from "@core";
import { AuthTokenRequest, AuthTokenResponse } from "type";
import { ContentType } from "type/global";

export class LoginService {
    static login(request: AuthTokenRequest): Promise<AuthTokenResponse> {
        return ajax("POST", "/api/auth/oauth/token", {}, request, { contentType: ContentType.FORM_CONTENT_TYPE } as any);
    }

    static logout(): Promise<AuthTokenResponse> {
        return ajax("DELETE", "/api/auth/token/logout", {}, {});
    }
}
