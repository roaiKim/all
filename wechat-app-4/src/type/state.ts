import { State } from "@core";
import { State as ChangePasswordState } from "@pages/common/change-password/type";
import { State as ProfileState } from "@pages/common/profile-center/profile/type";
import { State as UserState } from "@pages/common/profile-center/user/type";
import { State as HomeState } from "@pages/home/type";
import { State as MainState } from "@pages/main/type";
import { State as OrderSearchState } from "@pages/order-search/type";
import { State as TaskAbnormalState } from "@pages/task/abnormal/type";
import { State as TaskPickupDetailState } from "@pages/task/pickup/type";
import { State as TaskReceiptDetailState } from "@pages/task/receipt/type";
import { State as TaskState } from "@pages/task/task/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        orderSearch: OrderSearchState;
        user?: UserState;
        profile?: ProfileState;
        changePassword?: ChangePasswordState;
        task: TaskState;
        taskPickupDetail?: TaskPickupDetailState;
        taskReceiptDetail?: TaskReceiptDetailState;
        taskAbnormal?: TaskAbnormalState;
    };
}
