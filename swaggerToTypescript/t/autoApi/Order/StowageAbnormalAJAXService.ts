import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class StowageAbnormalAJAXService {
    // 添加异常;
    public static saveUsingPOST_2(): Promise<any> {
        return ajax("POST", "/stowageAbnormal/add", {}, {});
    }

    // 删除异常;
    public static deleteUsingPOST_3(): Promise<any> {
        return ajax("POST", "/stowageAbnormal/delete", {}, {});
    }

    // 处理异常;
    public static updateUsingPOST_1(): Promise<any> {
        return ajax("POST", "/stowageAbnormal/edit/{id}", {}, {});
    }

    // 列表;
    public static listUsingPOST_3(): Promise<any> {
        return ajax("POST", "/stowageAbnormal/list", {}, {});
    }

    // 获取详情;
    public static saveUsingGET_1(): Promise<any> {
        return ajax("GET", "/stowageAbnormal/{id}", {}, {});
    }
}
