import type { State } from "@core";
import type { State as LoginState } from "module/common/login/type";
import type { State as MainState } from "module/common/main/type";
import type { State as MenusState } from "module/common/menus/type";

export interface RootState extends State {
    app: {
        main: MainState;
        login: LoginState;
        menus: MenusState;
    };
}
