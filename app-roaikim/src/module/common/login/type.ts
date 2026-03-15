import { async } from "@core";
// import { AuthTokenResponse, CompanyInfoResponse } from "type/api.type";

export interface State {
    companyInfo: any;
    userInfo: any;
}

export const LoginComponent = async(() => import(/* webpackChunkName: "login" */ "./index"), "MainComponent");
