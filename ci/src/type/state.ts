import { State } from "@core";
import { State as HomeState } from "module/home/type";
import { State as MainState } from "module/common/main/type";
import { State as LoginState } from "module/login/type";
import { State as HeaderState } from "module/common/header/type";
import { State as MenuState } from "module/common/menus/type";
import { State as ProjectState } from "module/project/type";
import { State as WaybillState } from "module/waybill/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        login: LoginState;
        header: HeaderState;
        menus: MenuState;
        project?: ProjectState;
        waybill?: WaybillState;
    };
}
