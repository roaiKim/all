import { State } from "@core";
import { State as HomeState } from "pages/index/type";
import { State as ProfileState } from "pages/user/type";

export interface RootState extends State {
    app: {
        home: HomeState;
        profile: ProfileState;
    };
}
