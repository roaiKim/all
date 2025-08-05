import { ajax } from "@http";

export class GolbalService {
    static getDictionary(code: string): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/common/dictionary/getDictionaryByTypeAndStatus/${code}`, {});
    }

    static getByUserId() {
        // return new Promise((resolve, reject) => {
        //     return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId")
        //         .then((response) => {
        //             setTimeout(resolve, Math.random() * 6000 + 1000, response);
        //         })
        //         .catch((error) => {
        //             setTimeout(reject, Math.random() * 2000 + 1000, error);
        //         });
        // });
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }
}
