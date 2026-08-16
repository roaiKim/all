import { async } from "@core";
import type { ScenariosElementType } from "type";

export const moduleName = "material";

export interface RectPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ScenariosElement {
    uid: string;
    name?: string;
    type: ScenariosElementType;
    rect: RectPosition;
}

export interface Scenario {
    uid: string;
    name: string;
    background: string;
    element: ScenariosElement[];
}

export interface Scenarios {
    uid: string;
    name: string;
    background: string;
    scenario: Scenario[];
}

export interface State {
    activeScenarioKey: string;
    scenarios: Scenarios[];
}

export const MainComponent = async(() => import(/* webpackChunkName: "material" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/material",
    title: "Material",
    order: 1,
    component: MainComponent,
};
