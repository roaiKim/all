import { v4 } from "uuid";

export class ToolManager {
    /**
     * @description 获取一个Uid
     * @returns uid string
     */
    static getUid() {
        return v4();
    }

    // 处理数字精度问题
    static numberPrecision(number: number, precision = 2) {
        return Number(number.toFixed(precision));
    }

    // 处理数字精度问题
    static numberObjectPrecision<T extends Record<string, number>>(state: T): T {
        return Object.entries(state).reduce((prev, [key, value]) => ((prev[key] = this.numberPrecision(value)), prev), {}) as any;
    }

    // static getPluginInstance(type: string) {

    // }
}
