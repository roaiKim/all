import { ajax } from "@http";

export interface UserService$getUser$Response {
    id: string;
    name: string;
    phone: string;
    idCard: string;
    activeStatus: number;
    authenticationStatus: number;
    autoRegister: boolean;
    carSize: number;
    reviewStatus: string;
    driverTypeCode: string;
    driverTypeName: string;
    enterpriseType: string;
    serviceSupplierId: string;
    serviceSupplierName: string;
    tenantId: string;
    // attachments: unknown[];
    // certificateList: unknown[];
    // recordList: unknown[];
    driverSuppliers: DriverSupplier[];
    updateTime: number;
    updateUserId: string;
    updateUserName: string;
}

export interface DriverSupplier {
    id: string;
    driverId: string;
    supplierId: string;
}

export interface UserService$changePassword$Request {
    id: string;
    oldPassword: string;
    password: string;
    rePassword: string;
}

export class UserService {
    static getUser(id: string): Promise<UserService$getUser$Response> {
        return ajax("GET", "/driver/driverManagement/detail", { id }, "JSON");
    }

    static editProfile(request): Promise<void> {
        return ajax("PUT", "/client/personalCenter/edit", request, "JSON");
    }

    // 校验密码是否正确
    static validatePassword(password: string): Promise<void> {
        return ajax("POST", "/client/customer-user/checkPassword", { password }, "FORM");
    }

    // 修改密码
    static changePassword(request: UserService$changePassword$Request): Promise<void> {
        return ajax("POST", "/admin/account/password/change", request);
    }
}
