import { BASIC_AUTH_TOKEN, WEB_TOKEN } from "config/static-envs";
import { StorageService } from "utils/StorageService";

export function getToken() {
    let TOKEN = "";
    return () => {
        if (TOKEN) {
            return `Bearer ${TOKEN}`;
        }
        TOKEN = StorageService.get(WEB_TOKEN) || "";
        return TOKEN ? `Bearer ${TOKEN}` : BASIC_AUTH_TOKEN;
    };
}
