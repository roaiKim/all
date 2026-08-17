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

export interface ScenarioState {
    uid: string;
    name: string;
    background: string;
    main: Scenario[];
    children: Scenario[];
}

export interface MaterialItem {
    uid: string;
    name: string;
    path: string;
    thumb: string;
    type: "image" | "video";
}

export interface State {
    activeScenarioKey: string;
    scenarios: Map<string, ScenarioState>;
    scenariosOrder: string[];
    materials: MaterialItem[];
}

export const MainComponent = async(() => import(/* webpackChunkName: "material" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/material",
    title: "Material",
    order: 1,
    component: MainComponent,
};
