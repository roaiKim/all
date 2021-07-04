import { ajax } from "core";

export class FileManagementService {

    static list() {
        return ajax("GET", "/api/file-down/list", {});
    }

}
