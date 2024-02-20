import { LoginServiceLoginResponse } from "service/public-api/LoginService";

export interface State {
    name: string;
    accessToken: string;
    loggedin: boolean;
    loginInfo: LoginServiceLoginResponse;
}
