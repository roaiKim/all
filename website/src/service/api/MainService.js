import { ajax } from "core";

export class MainService {
    /* static getUser(request) {
        return ajax("GET", "http://119.29.53.45:3200/api/user/check", request);
    } */

    static getUser(request) {
        return ajax("GET", "/api/user/check", request, {bail: true});
    }

    static login() {
        return ajax("POST", "/api/user/login", {
            "name": "woaini",
            "password": "1234"
        }, {bail: true});
    }
}