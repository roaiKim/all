import { KeepState, Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { verifiable } from "utils/decorator/verifiable";
import { Toast } from "utils/ui/toast";
import { roBackHistory, roPushHistory } from "utils";
import { withConfirm } from "utils/decorator/withConfirm";
import { State } from "./type";
import { AddressService, AddressService$addAddress$Request } from "./service";

const initialAddressState: State = {
    name: "address",
    Q: [],
    P: [],
    tabKey: 0,
    addressValuesIndex: [],
    provinces: [],
    citys: [],
    districts: [],
    streets: [],
    analysisAddress: null,
};

@verifiable
class AddressModule extends Module<RootState, "address"> {
    onEnter(params: Record<string, any>, pageName: string): void | Promise<void> {
        if (pageName === "addition") {
            this.fetchProvinces();
        }
    }

    onShow(params: Record<string, any>, pageName: string): void | Promise<void> {
        const { tabKey } = params || {};
        this.getAddress(tabKey || this.state.tabKey || 0);
    }

    @KeepState()
    onDestroy(pageName: string) {
        if (pageName === "addition") {
            this.setState({ analysisAddress: null });
        }
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
            this.setState({ [fidle]: response.data, tabKey: type } as any);
        } else {
            this.setState({ [fidle]: [], tabKey: type } as any);
        }
    }

    @Loading()
    async addAddress(request: AddressService$addAddress$Request) {
        await AddressService.addAddress(request);
        Toast.text();
        roBackHistory();
    }

    @Loading()
    async editAddress(request: AddressService$addAddress$Request) {
        await AddressService.editAddress(request);
        Toast.text();
        roBackHistory();
    }

    @withConfirm()
    @Loading()
    async deleteAddress(ids: string[]) {
        await AddressService.deleteAddress(ids);
        Toast.text();
        this.getAddress(this.state.tabKey);
    }

    @Loading()
    async setDefaultAddress(id: string) {
        await AddressService.setDefaultAddress(id);
        Toast.text();
        this.getAddress(this.state.tabKey);
    }

    toggleTabkey(tabKey: number) {
        this.setState({ tabKey });
        this.getAddress(tabKey);
    }

    @Loading()
    async analysisAddressByText(text) {
        const address = await AddressService.analysisAddressByText(text);
        const { province, city, area, detail, mobile, name } = address;
        if (province || mobile || name) {
            this.setState({
                analysisAddress: {
                    person: name,
                    phoneNumber: mobile,
                    detailAddress: detail,
                    province: province,
                    city: city,
                    district: area,
                },
            });
        }
    }

    async toEditAddressPageAction(address: AddressService$addAddress$Request) {
        roPushHistory("/pages/profile-center/address/addition");
        this.setState({ analysisAddress: address });
    }

    addressPicker(column, value) {
        if (column >= 3) return; // 街道改变不触发
        // 自动匹配地址等信息
        const addressFields = ["provinces", "citys", "districts", "streets"];
        const addressFunctions = ["fetchProvinces", "fetchCitys", "fetchDistricts", "fetchStreets"];
        try {
            const currentAddress = this.state[addressFields[column]];
            const currentAddressId = currentAddress[value].id;
            this[addressFunctions[column + 1]](currentAddressId, value);
        } catch (e) {
            //
        }
    }

    async fetchProvinces() {
        const provinces = await AddressService.fetchProvinces();
        this.setState({ provinces: provinces || [] });
        if (provinces?.length) {
            this.fetchCitys(provinces[0].id);
        }
    }

    async fetchCitys(id: string, value?: number) {
        const citys = await AddressService.fetchCitys(id);
        this.setState({ citys: citys || [], addressValuesIndex: [value || 0, 0, 0] });
        if (citys?.length) {
            this.fetchDistricts(citys[0].id);
        }
    }

    async fetchDistricts(id: string, value?: number) {
        const districts = await AddressService.fetchDistricts(id);
        const { addressValuesIndex } = this.state;
        this.setState({ districts: districts || [], addressValuesIndex: addressValuesIndex.slice(0, 1).concat([value || 0, 0, 0]) });
        if (districts?.length) {
            this.fetchStreets(districts[0].id);
        }
    }

    async fetchStreets(id: string, value?: number) {
        const streets = await AddressService.fetchStreets(id);
        const { addressValuesIndex } = this.state;
        this.setState({ streets: streets || [], addressValuesIndex: addressValuesIndex.slice(0, 2).concat([value || 0, 0]) });
    }

    setAddressValuesIndex(values?: number[]) {
        this.setState({ addressValuesIndex: values || [0, 0, 0, 0] });
        if (!values) {
            this.fetchProvinces();
        }
    }
}

const module = register(new AddressModule("address", initialAddressState));
const actions = module.getActions();

export { module, actions };
