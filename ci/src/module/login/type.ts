import { async } from "@core";
import { AuthTokenResponse, CompanyInfoResponse } from "type";
import { ModuleStatement } from "utils/function/loadComponent";

export interface State {
    companyInfo: CompanyInfoResponse | null;
    userInfo: AuthTokenResponse | null;
}

const MainComponent = async(() => import(/* webpackChunkName: "login" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    path: "/login",
    title: "Login",
    order: 1,
    component: MainComponent,
};
