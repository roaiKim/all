import { AddressService$getAddressList$Response } from "./service";

export interface State {
    name: string;
    Q: AddressService$getAddressList$Response[];
    P: AddressService$getAddressList$Response[];
    tabKey: number;
}
