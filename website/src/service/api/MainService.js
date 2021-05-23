import { ajax } from "core";

export class MainService {
    /* static getUser(request) {
        return ajax("GET", "http://119.29.53.45:3200/api/user/check", request);
    } */

    static getUser(request) {
        return ajax("GET", "http://127.0.0.1:3200/api/user/check", request);
    }

    static login() {
        return ajax("POST", "http://127.0.0.1:3200/api/user/login", {
            "name": "woaini",
            "password": "1234"
        });
    }
}