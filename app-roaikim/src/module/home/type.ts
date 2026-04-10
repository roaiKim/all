import { async } from "@core";
// import { AuthTokenResponse, CompanyInfoResponse } from "type/api.type";

export interface State {
    name: string;
}

export const HomeComponent = async(() => import(/* webpackChunkName: "home" */ "./index"), "MainComponent");
