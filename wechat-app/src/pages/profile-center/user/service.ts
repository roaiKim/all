import { ajax } from "@http";

export class UserService {
    static getUser(): Promise<UserService$getUser$Response> {
        return ajax("GET", "/client/personalCenter/getPersonalInformation", null, "JSON");
    }
    static editProfile(request): Promise<void> {
        return ajax("PUT", "/client/personalCenter/edit", request, "JSON");
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
