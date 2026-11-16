import { State } from "@core";
import { State as HomeState } from "pages/home/type";
import { State as LoginState } from "pages/login/type";
import { State as MainState } from "pages/main/type";
import { State as OrderSearchState } from "pages/order-search/type";
import { State as AddressState } from "pages/profile-center/address/type";
import { State as ProfileState } from "pages/profile-center/profile/type";
import { State as UserState } from "pages/profile-center/user/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        login: LoginState;
        orderSearch: OrderSearchState;
        profile: ProfileState;
        user?: UserState;
        address?: AddressState;
    };
}
