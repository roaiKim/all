import { async } from "@core";

export const NoFountComponent = async(() => import(/* webpackChunkName: "404" */ "./index"), "MainComponent");
