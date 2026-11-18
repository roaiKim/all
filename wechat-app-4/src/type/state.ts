import { State } from "@core";
import { State as UserState } from "@pages/common/profile-center/user/type";
import { State as HomeState } from "@pages/home/type";
import { State as MainState } from "@pages/main/type";
import { State as OrderSearchState } from "@pages/order-search/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        orderSearch: OrderSearchState;
        user?: UserState;
    };
}
