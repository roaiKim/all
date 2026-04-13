import type { State } from "@core";
import type { State as AddressState } from "module/client/address/type";
import type { State as ManagementState } from "module/client/management/type";
import type { State as PackageState } from "module/client/package/type";
import type { State as HeaderState } from "module/common/header/type";
import type { State as LoginState } from "module/common/login/type";
import type { State as MainState } from "module/common/main/type";
import type { State as MenusState } from "module/common/menus/type";
import type { State as HomeState } from "module/home/type";

export interface RootState extends State {
    app: {
        header: HeaderState;
        login: LoginState;
        main: MainState;
        menus: MenusState;
        home: HomeState;
        management: ManagementState;
        address: AddressState;
        package: PackageState;
    };
}
