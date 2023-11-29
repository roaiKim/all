import { async } from "@core";
import { AuthTokenResponse, CompanyInfoResponse } from "type";

export interface State {
    companyInfo: CompanyInfoResponse | null;
    userInfo: AuthTokenResponse | null;
}

export const LoginComponent = async(() => import(/* webpackChunkName: "login" */ "./index"), "MainComponent");
