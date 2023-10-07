import { ajax } from "@http";
import { AdvancedPageResponse } from "type/global";

export class AddressService {
    static getAddressList(request): Promise<AdvancedPageResponse<AddressService$getAddressList$Response>> {
        return ajax("POST", "/client/addressBook/advanced-page", request);
    }
}

export interface AddressService$getAddressList$Response {
    createUserName: string;
    createUserId: string;
    createTime: number;
    updateTime: number;
    updateUserId: string;
    updateUserName: string;
    id: string;
    person: string;
    phoneNumber: string;
    province: string;
    city: string;
    district: string;
    detailAddress: string;
    longitude: number;
    latitude: number;
    defaultAddress: number;
    addressType: number;
}
