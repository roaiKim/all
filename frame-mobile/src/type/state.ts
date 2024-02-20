/*eslint-disable simple-import-sort/imports */

import { State } from "@core";
import { State as MainState } from "module/common/main/type";
import { State as FinanceState } from "module/finance/type";
import { State as OperationState } from "module/operation/type";
import { State as QualityState } from "module/quality/type";

export interface RootState extends State {
    app: {
        main: MainState;
        finance: FinanceState;
        operation?: OperationState;
        quality?: QualityState;
    };
}
