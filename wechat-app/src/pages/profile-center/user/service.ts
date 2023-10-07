import { ajax } from "@http";

export class UserService {
    static getUser(): Promise<UserService$getUser$Response> {
        return ajax("GET", "/client/personalCenter/getPersonalInformation", null, "JSON");
    }

    static editProfile(request): Promise<void> {
        return ajax("PUT", "/client/personalCenter/edit", request, "JSON");
    }

    // 校验密码是否正确
    static validatePassword(password: string): Promise<void> {
        return ajax("POST", "/client/customer-user/checkPassword", { password }, "FORM");
    }

    // 修改密码
    static changePassword(password): Promise<void> {
        return ajax("PUT", "/client/customer-user/updatePassword", { password }, "FORM");
    }
}

export interface UserService$getUser$Response {
    account: string;
    accountAttributionId: string;
    accountType: number;
    activeStatus: number;
    createTime: number;
    createUserId: string;
    createUserName: string;
    customerUser: string;
    dueDate: number;
    id: string;
    mail: string;
    openId: string;
    password: string;
    phoneNumber: string;
    postCode: string;
    postName: string;
    source: number;
    updateTime: number;
    updateUserId: string;
    updateUserName: string;
}
