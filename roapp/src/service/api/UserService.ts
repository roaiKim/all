import { ajax } from "@core";

export class UserService {
    static check(request) {
        return ajax("GET", "user/check", {}, request, null);
    }
}
