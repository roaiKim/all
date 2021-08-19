import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAbnormalAJAXService {
    /**
     * @description 添加异常
     * @returns string
     */
    public static saveUsingPOST_2(): Promise<string> {
        return ajax("POST", "/stowageAbnormal/add", {}, {});
    }

    /**
     * @description 删除异常
     * @returns string
     */
    public static deleteUsingPOST_3(): Promise<string> {
        return ajax("POST", "/stowageAbnormal/delete", {}, {});
    }

    /**
     * @description 处理异常
     * @returns string
     */
    public static updateUsingPOST_1(): Promise<string> {
        return ajax("POST", "/stowageAbnormal/edit/{id}", {}, {});
    }

    /**
     * @description 列表
     * @returns Page<StowageAbnormal>
     */
    public static listUsingPOST_3(): Promise<Page<StowageAbnormal>> {
        return ajax("POST", "/stowageAbnormal/list", {}, {});
    }

    /**
     * @description 获取详情
     * @returns StowageAbnormal
     */
    public static saveUsingGET_1(): Promise<StowageAbnormal> {
        return ajax("GET", "/stowageAbnormal/{id}", {}, {});
    }
}
