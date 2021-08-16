import {app} from "@src/models";
export const openTabs = () => {
    const OPEN_TABS = ["BUSINESS_MANAGEMENT_ALLOCATE_LIST", "STOWAGE_CENTER", "SETTLEMENT_ACCOUNT_RECEIVABLE", "ROUTE", "ORDER_V2"];
    OPEN_TABS.forEach((key) => {
        app._store.dispatch({
            type: "global/openTab",
            payload: {
                key,
                component: key,
            },
        });
    });
};
