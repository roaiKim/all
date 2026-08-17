import { v4 } from "uuid";
import type { ScenarioState } from "module/material/type";
import { generateUid } from "utils/framework";

export function initialScenario(): ScenarioState {
    return {
        uid: generateUid(),
        name: "新建幕章",
        background: "",
        main: [],
        children: [],
    };
}
