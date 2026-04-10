import type { State } from "@core";
import type { State as ClientAddressState } from "module/client/client-address/type";
import type { State as ClientManagementState } from "module/client/client-management/type";
import type { State as HeaderState } from "module/common/header/type";
import type { State as LoginState } from "module/common/login/type";
import type { State as MainState } from "module/common/main/type";
import type { State as MenusState } from "module/common/menus/type";

export interface RootState extends State {
  app: {
    clientAddress: ClientAddressState;
    clientManagement: ClientManagementState;
    header: HeaderState;
    login: LoginState;
    main: MainState;
    menus: MenusState;
  };
}
