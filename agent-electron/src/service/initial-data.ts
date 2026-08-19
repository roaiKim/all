import { v4 } from "uuid";
import type { AssetMaterial, Scenario, ScenarioState } from "module/material/type";
import { generateUid } from "utils/framework";

export function initialAssetMaterial(): AssetMaterial {
    return {
        uid: generateUid(),
        name: "",
        path: "",
        thumb: "",
        type: "image",
    };
}

export function initialScenarioState(): Scenario {
    return {
        uid: generateUid(),
        name: "",
        background: initialAssetMaterial(),
        backgroundShowModal: "cover",
        autoPlay: false,
        element: [],
    };
}

export function initialScenario(): ScenarioState {
    return {
        uid: generateUid(),
        name: "新建幕章",
        main: initialScenarioState(),
        children: [],
    };
}
