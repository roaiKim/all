import { v4 } from "uuid";

export class UidManager {
    /**
     * @description 获取一个Uid
     * @returns uid string
     */
    static getUid() {
        return v4();
    }
}
