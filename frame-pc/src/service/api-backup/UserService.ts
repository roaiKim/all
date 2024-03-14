import { ajax } from "@http";

export interface PasswordRequest {
    oldPassword: string;
    password: string;
}

export interface AddInvoiceRequest {
    bankAccount: string;
    customerId?: number;
    customerName?: string;
    customerUserManagementId?: string;
    depositaryBank?: string;
    id?: string;
    invoiceTitle: string;
    isDefault: number;
    mail: string;
    registerAddress?: string;
    registerPhoneNumber?: string;
    taxNumber: string;
}

export interface InvoiceResponse extends AddInvoiceRequest {
    createUserId: string;
    createUserName: string;
    createTime: number;
    updateTime: number;
    updateUserId: string;
    updateUserName: string;
}

export interface AddressRecord {
    addressName: string;
    addressType: number;
    city: string;
    companyAddress: string;
    companyDetailAddress: string;
    connectInformations: any[];
    countryType: number;
    createTime: string;
    id: string;
    province: string;
    district: string;
    street: string;
}
export interface AddAddress extends AddressRecord {
    connects?: { postName: string; postCode: string; phoneNumber: string; contactPerson: string }[];
}
export interface AddressInfo {
    current: string | number;
    pages: string | number;
    size: string | number;
    total: string | number;
    records: AddressRecord[];
}

export interface CityRecord {
    administrativeCode: string | number;
    id: string;
    level: number;
    name: string;
    parentId: string | number;
    value: string;
    label: string;
    children?: CityRecord[];
}
export interface PositionColumns {
    value: string;
    label: string;
}

export class UserService {
    static getCustomerDetail(request): Promise<any> {
        return ajax("GET", "/api/common/customerBasicInformation/detail", request);
    }

    static getUserDetailByUserId(id): Promise<Record<string, any>> {
        return ajax("GET", "/api/common/customerUserManagement/detail");
    }

    static password(id: string, request: PasswordRequest): Promise<Record<string, any>> {
        return ajax("POST", `/api/common/h5customerUser/password/update/${id}`, request, "FORM");
    }

    static invoice(id: string): Promise<InvoiceResponse[]> {
        return ajax("GET", `/api/common/h5customerUser/invoiceTitle/${id}`);
    }

    static address(request: any): Promise<AddressInfo> {
        return ajax("POST", "/api/common/h5CustomerAddress/customerAddressList", request, "FORM");
    }

    static addInvoice(request: AddInvoiceRequest): Promise<Record<string, any>> {
        return ajax("POST", "/api/common/h5customerUser/invoiceTitle/save", request);
    }

    static updateInvoice(request: AddInvoiceRequest): Promise<Record<string, any>> {
        return ajax("POST", "/api/common/h5customerUser/invoiceTitle/update", request);
    }

    static deteleInvoice(ids: string[]): Promise<Record<string, any>> {
        return ajax("POST", "/api/common/h5customerUser/invoiceTitle/delete", ids);
    }

    static deteleAddress(id: string): Promise<Record<string, any>> {
        return ajax("DELETE", "/api/common/h5CustomerAddress/remove", { id }, "FORM");
    }

    static getAllProvinces(): Promise<CityRecord[]> {
        return ajax("GET", "/api/common/district/getAllProvinces");
    }

    static getCity(id: string): Promise<CityRecord[]> {
        return ajax("GET", `/api/common/district/getCitiesByProvinceCode/${id}`);
    }

    static getDistrict(id: string): Promise<CityRecord[]> {
        return ajax("GET", `/api/common/district/getAreasByCityCode/${id}`);
    }

    static getStreet(id: string): Promise<CityRecord[]> {
        return ajax("GET", `/api/common/district/getStreetsByAreaCode/${id}`);
    }

    static addAddress(request: AddAddress): Promise<Record<string, any>> {
        return ajax("POST", "/api/common/h5CustomerAddress/saveCustomerAddress", request);
    }
}
