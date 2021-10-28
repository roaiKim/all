import { ajax } from "core";
import { Auth } from "@tools";

export class TableService {
    static table(request) {
        return ajax("GET", "/api/user/check", {}, request, { bail: true }, true);
    }

    @Auth()
    static getTable() {
        return new Promise((resolve) => {
            resolve(require("../json/table.1.json"));
        });
    }
}
