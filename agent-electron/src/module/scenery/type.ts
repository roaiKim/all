import { async } from "@core";

export const moduleName = "scenery";

export interface State {}

export const MainComponent = async(() => import(/* webpackChunkName: "scenery" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/scenery",
    title: "Scenery",
    order: 1,
    component: MainComponent,
};
