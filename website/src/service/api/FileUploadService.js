import { ajax } from "core";

export class FileUploadService {

    static upload(request) {
        return ajax("POST", "/api/file/upload", {}, request, {
            headers: {
                // "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryM1VnnBuPzZjCyuK1",
            },
        }, true);
    }

}
