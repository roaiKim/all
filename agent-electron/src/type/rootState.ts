import type { State } from "@core";
import type { State as AttributeState } from "module/attribute/type";
import type { State as MainState } from "module/main/type";
import type { State as MaterialState } from "module/material/type";
import type { State as ScenarioState } from "module/scenario/type";
import type { State as SceneryState } from "module/scenery/type";

export interface RootState extends State {
    app: {
        main: MainState;
        scenario: ScenarioState;
        material: MaterialState;
        scenery: SceneryState;
        attribute: AttributeState;
    };
}
