import { State } from "core";
import { State as HomeState } from "module/home/type";

export interface RootState extends State {
    app: {
        home: HomeState;
    };
}
