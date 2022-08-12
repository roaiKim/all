import { ajax } from "network";

export class GolbalService {
    static getDictionary(code: string): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/common/dictionary/getDictionaryByTypeAndStatus/${code}`, {}, {});
    }

    static getByUserId() {
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }
}
