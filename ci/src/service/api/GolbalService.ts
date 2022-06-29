import { ajax } from "@core";

export class GolbalService {
    static getDictionary(code: string): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/common/dictionary/getDictionaryByTypeAndStatus/${code}`, {}, {});
    }
}
