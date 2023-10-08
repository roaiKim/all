import { ajax } from "@http";
import { AdvancedPageRequest, AdvancedPageResponse } from "type/global";

export class AddressService {
    static getAddressList(request: AdvancedPageRequest): Promise<AdvancedPageResponse<AddressService$addAddress$Request>> {
        return ajax("POST", "/client/addressBook/advanced-page", request);
    }

    static fetchProvinces(): Promise<AddressService$Address$Response[]> {
        return ajax("GET", "/common/district/getAllProvinces", null);
    }

    static fetchCitys(id: string): Promise<AddressService$Address$Response[]> {
        return ajax("GET", "/common/district/getCitiesByProvinceCode/" + id, null);
    }

    static fetchDistricts(id: string): Promise<AddressService$Address$Response[]> {
        return ajax("GET", "/common/district/getAreasByCityCode/" + id, null);
    }

    static fetchStreets(id: string): Promise<AddressService$Address$Response[]> {
        return ajax("GET", "/common/district/getStreetsByAreaCode/" + id, null);
    }

    static analysisAddressByText(text: string): Promise<AddressService$analysisAddressByText$Response> {
        return ajax("GET", "/client/addressBook/getAddressParse", { address: text });
    }

    static addAddress(request: AddressService$addAddress$Request): Promise<void> {
        return ajax("POST", "/client/addressBook/save", request);
    }

    static editAddress(request: AddressService$addAddress$Request): Promise<void> {
        return ajax("PUT", "/client/addressBook/edit", request);
    }

    static deleteAddress(ids: string[]): Promise<void> {
        return ajax("DELETE", "/client/addressBook/remove", ids);
    }

    static setDefaultAddress(id: string): Promise<void> {
        return ajax("PUT", "/client/addressBook/setDefaultAddress/" + id, null);
    }
}

export interface AddressService$Address$Response {
    administrativeCode: string | number;
    id: string;
    level: number;
    name: string;
    parentId: string | number;
    value: string;
    code: string;
    children?: AddressService$Address$Response[];
}

export interface AddressService$analysisAddressByText$Response {
    area: string;
    city: string;
    detail: string;
    mobile: string;
    name: string;
    phone: string;
    province: string;
    type: string;
    zipCode: string;
}

export interface AddressService$addAddress$Request {
    addressType: number;
    city: string;
    createTime?: string;
    createUserId?: number;
    createUserName?: string;
    defaultAddress: number;
    detailAddress: string;
    district: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    person: string;
    phoneNumber: string;
    province: string;
    receiverCompanyName?: string;
    senderCompanyName?: string;
    street?: string;
    updateTime?: string;
    updateUserId?: number;
    updateUserName?: string;
}
