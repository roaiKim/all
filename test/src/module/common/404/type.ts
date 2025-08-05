import { async } from "@core";

export interface State {}

export const NoFountComponent = async(() => import(/* webpackChunkName: "404" */ "./index"), "MainComponent");
