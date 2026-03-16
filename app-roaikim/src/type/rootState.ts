import type { State } from "@core";
import type { State as MainState } from "module/common/main/type";

export interface RootState extends State {
    app: {
        main: MainState;
    };
}
