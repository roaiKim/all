import { State } from "@core";
import { State as HomeState } from "pages/home/type";
import { State as LoginState } from "pages/login/type";
import { State as OrderSearchState } from "pages/order-search/type";
import { State as ProfileState } from "pages/profile/type";

export interface RootState extends State {
    app: {
        home: HomeState;
        login: LoginState;
        orderSearch: OrderSearchState;
        profile: ProfileState;
    };
}
