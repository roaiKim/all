import { stringify } from "querystring";
import type { AuthTokenRequest, AuthTokenResponse } from "type/api.type";
import { ajax } from "@http";

export class LoginService {
    static login(request: AuthTokenRequest): Promise<AuthTokenResponse> {
        const requestString = `grant_type=password&username=admin&password=K7IDzqnnWIMoVgu7eGIbKvnDC84%2FPx1cSUtSQ8qmJ7yijt%2BblNR%2FQkcO8lQRa1DGB0JdbI1MQMA7p%2FeeLzG%2BxQ5WYXBUqAakp4SCkfcW8v%2FRlUQxDMyTYPOFvYqVylZIFmPogDeOUSDPyQlQtN3fWoBno0P5ted%2BMS2iyLvltMOxQBTANLd%2Fw%2F1gYBCWsdnustjZB68z6%2Bd19Xvqd6NBhodstPCYAW39l7c%2F5bZLQ9s81LvjaUfx9OuXnaweMwH2gS3qVbLZ68iPwbFRNx%2FAqPuITKefwqiVOvRSxaO7lex5bvN9QYEYbeERCUkNVb0p%2F3KHNIfT9eOgyKkoMUP9Ng%3D%3D&randomStr=244e1294-6a24-4317-abf3-287d1036aeb7&code=0000`; // stringify(request as any);
        return ajax("POST", `/api/auth/oauth/token?${requestString}`, requestString, "FORM");
    }

    static logout(): Promise<AuthTokenResponse> {
        return ajax("DELETE", "/api/auth/token/logout", null, null);
    }
}
