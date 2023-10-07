import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { verifiable } from "utils/decorator/verifiable";
import { State } from "./type";
import { AddressService } from "./service";

const initialAddressState: State = {
    name: "address",
    Q: [],
    P: [],
    tabKey: 0,
};

@verifiable
class AddressModule extends Module<RootState, "address"> {
    @Loading()
    onShow(params, pageName): void | Promise<void> {
        const { tabKey } = params || {};
        this.getAddress(tabKey || 0);
    }

    @Loading()
    async getAddress(type: number) {
        const conditionBodies: any = [
            {
                conditions: [{ property: "addressType", values: [type], type: "EQUAL" }],
            },
        ];
        const response = await AddressService.getAddressList({
            conditionBodies,
            limit: 999,
            offset: 0,
            pageNo: 1,
            pageSize: 999,
        });
        const fidle: keyof Pick<State, "P" | "Q"> = type ? ("P" as const) : ("Q" as const);
        if (response.data?.length) {
            this.setState({ [fidle]: response.data } as any);
        } else {
            this.setState({ [fidle]: [] } as any);
        }
    }

    toggleTabkey(tabKey: number) {
        this.setState({ tabKey });
        this.getAddress(tabKey);
    }
}

const module = register(new AddressModule("address", initialAddressState));
const actions = module.getActions();

export { module, actions };
