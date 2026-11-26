import { State } from "@core";
import { State as ChangePasswordState } from "@pages/common/change-password/type";
import { State as ProfileState } from "@pages/common/profile-center/profile/type";
import { State as UserState } from "@pages/common/profile-center/user/type";
import { State as HomeState } from "@pages/home/type";
import { State as MainState } from "@pages/main/type";
import { State as OrderSearchState } from "@pages/order-search/type";
import { State as CargoDetailState } from "@pages/task/cargo-detail/type";
import { State as ExceptionReportState } from "@pages/task/exception-report/type";
import { State as PickupDetailState } from "@pages/task/pickup-detail/type";
import { State as ReceiptDetailState } from "@pages/task/receipt-detail/type";
import { State as ReceiptRecordsState } from "@pages/task/receipt-records/type";
import { State as ExampleState } from "@pages/zz-example/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        orderSearch: OrderSearchState;
        user?: UserState;
        profile?: ProfileState;
        changePassword?: ChangePasswordState;
        example?: ExampleState;
        cargoDetail?: CargoDetailState;
        exceptionReport?: ExceptionReportState;
        pickupDetail?: PickupDetailState;
        receiptDetail?: ReceiptDetailState;
        receiptRecords?: ReceiptRecordsState;
    };
}
