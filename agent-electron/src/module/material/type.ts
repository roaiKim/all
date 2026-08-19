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

export enum BackgroundShowModal {
    "contain" = "contain",
    "cover" = "cover",
    "scale-down" = "scale-down",
    "fill" = "fill",
    "none" = "none",
}

export interface Scenario {
    uid: string;
    name: string;
    background: AssetMaterial;
    backgroundShowModal: BackgroundShowModal | keyof typeof BackgroundShowModal;
    autoPlay: boolean;
    element: ScenariosElement[];
}

export interface ScenarioState {
    uid: string;
    name: string;
    main: Scenario;
    children: Scenario[];
}

export interface AssetMaterial {
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
    materials: AssetMaterial[];
}

export const MainComponent = async(() => import(/* webpackChunkName: "material" */ "./index"), "MainComponent");

export const statement: ModuleStatement = {
    name: moduleName,
    path: "/material",
    title: "Material",
    order: 1,
    component: MainComponent,
};
