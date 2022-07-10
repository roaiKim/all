import { State } from "@core";
import { State as HomeState } from "pages/index/type";

export interface RootState extends State {
    app: {
        home: HomeState;
    };
}
