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
    static getPermissionByUserId() {
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }
}
