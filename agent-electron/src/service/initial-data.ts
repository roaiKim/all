import { v4 } from "uuid";
import type { AssetMaterial, ScenarioState } from "module/material/type";
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

export function initialScenario(): ScenarioState {
    return {
        uid: generateUid(),
        name: "新建幕章",
        background: initialAssetMaterial(),
        main: [],
        children: [],
    };
}
