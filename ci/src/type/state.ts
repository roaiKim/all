import { State } from "@core";
import { State as HomeState } from "module/home/type";
import { State as MainState } from "module/common/main/type";
import { State as LoginState } from "module/login/type";
import { State as HeaderState } from "module/common/header/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        login: LoginState;
        header: HeaderState;
    };
}
