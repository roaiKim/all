import { ajax } from "core";

export class TableService {

    static table(request) {
        return ajax("GET", "/api/user/check", {}, request, { bail: true }, true);
    }

    static getTable() {
        return new Promise((resolve) => {
            resolve(require("../json/table.1.json"));
        });
    }

}
