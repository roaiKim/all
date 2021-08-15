import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class CustomsAJAXService {
    // 订单已报关统计;
    public static customsCargoCountUsingGET(): Promise<any> {
        return ajax("GET", "/customs/cargoCount/{orderId}", {}, {});
    }

    // 删除报关单;
    public static deleteUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/delete", {}, {});
    }

    // 打包下载报关单关联的订单附件;
    public static batchDownloadUsingGET(): Promise<any> {
        return ajax("GET", "/customs/download/{orderId}", {}, {});
    }

    // 打包下载报关单附件;
    public static downloadCustomsZipUsingGET(): Promise<any> {
        return ajax("GET", "/customs/downloadCustomsZip/{id}", {}, {});
    }

    // 创建报关单;
    public static editCustomsUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/edit", {}, {});
    }

    // 根据报关单;
    public static getDownloadLogUsingGET(): Promise<any> {
        return ajax("GET", "/customs/getDownloadLog/{id}", {}, {});
    }

    // 查看操作日志;
    public static getLogUsingGET(): Promise<any> {
        return ajax("GET", "/customs/getLog/{id}", {}, {});
    }

    // 报关单列表;
    public static listUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/list", {}, {});
    }

    // 创建报关单;
    public static saveCustomsUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/save", {}, {});
    }

    // 保存报关日志;
    public static saveCustomsLogUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/saveCustomsLog", {}, {});
    }

    // 保存预录报关日志;
    public static saveForecastLogUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/saveForecastLog", {}, {});
    }

    // 报关附件上传;
    public static uploadAttachmentUsingPOST(): Promise<any> {
        return ajax("POST", "/customs/uploadAttachment", {}, {});
    }

    // 获取报关单详情;
    public static getByIdUsingGET(): Promise<any> {
        return ajax("GET", "/customs/{id}", {}, {});
    }
}
