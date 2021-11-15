import { State } from "@core";
import { State as HomeState } from "module/home/type";
import { State as MainState } from "module/main/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
    };
}
