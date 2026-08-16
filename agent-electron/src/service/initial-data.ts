import { v4 } from "uuid";
import type { Scenarios } from "module/material/type";

export function generateUid() {
    return v4();
}

export function initialScenario(): Scenarios {
    return {
        uid: generateUid(),
        name: "新建幕章",
        background: "",
        scenario: [],
    };
}
