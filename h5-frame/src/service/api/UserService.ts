import { ajax } from "@http";

export class UserService {
    static getPermissionByUserId() {
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }
}
