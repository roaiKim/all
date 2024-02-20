import { AddressService$addAddress$Request, AddressService$Address$Response } from "./service";

export interface State {
    name: string;
    Q: AddressService$addAddress$Request[];
    P: AddressService$addAddress$Request[];
    tabKey: number;
    addressValuesIndex: number[];
    provinces: AddressService$Address$Response[];
    citys: AddressService$Address$Response[];
    districts: AddressService$Address$Response[];
    streets: AddressService$Address$Response[];
    analysisAddress: Partial<AddressService$addAddress$Request>;
}
