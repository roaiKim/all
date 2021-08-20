import {OrderCargoCount, CustomsDownloadLog, CustomsLog, Page, Customs} from "../orderType";
import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class CustomsAJAXService {
    /**
     * @description 订单已报关统计
     * @returns OrderCargoCount
     */
    public static customsCargoCountUsingGET(): Promise<OrderCargoCount> {
        return ajax("GET", "/customs/cargoCount/{orderId}", {}, {});
    }

    /**
     * @description 删除报关单
     * @returns string
     */
    public static deleteUsingPOST(): Promise<string> {
        return ajax("POST", "/customs/delete", {}, {});
    }

    /**
     * @description 打包下载报关单关联的订单附件
     * @returns void
     */
    public static batchDownloadUsingGET(): Promise<void> {
        return ajax("GET", "/customs/download/{orderId}", {}, {});
    }

    /**
     * @description 打包下载报关单附件
     * @returns void
     */
    public static downloadCustomsZipUsingGET(): Promise<void> {
        return ajax("GET", "/customs/downloadCustomsZip/{id}", {}, {});
    }

    /**
     * @description 创建报关单
     * @returns number
     */
    public static editCustomsUsingPOST(): Promise<number> {
        return ajax("POST", "/customs/edit", {}, {});
    }

    /**
     * @description 根据报关单
     * @returns CustomsDownloadLog[]
     */
    public static getDownloadLogUsingGET(): Promise<CustomsDownloadLog[]> {
        return ajax("GET", "/customs/getDownloadLog/{id}", {}, {});
    }

    /**
     * @description 查看操作日志
     * @returns CustomsLog[]
     */
    public static getLogUsingGET(): Promise<CustomsLog[]> {
        return ajax("GET", "/customs/getLog/{id}", {}, {});
    }

    /**
     * @description 报关单列表
     * @returns Page<Customs>
     */
    public static listUsingPOST(): Promise<Page<Customs>> {
        return ajax("POST", "/customs/list", {}, {});
    }

    /**
     * @description 创建报关单
     * @returns number
     */
    public static saveCustomsUsingPOST(): Promise<number> {
        return ajax("POST", "/customs/save", {}, {});
    }

    /**
     * @description 保存报关日志
     * @returns string
     */
    public static saveCustomsLogUsingPOST(): Promise<string> {
        return ajax("POST", "/customs/saveCustomsLog", {}, {});
    }

    /**
     * @description 保存预录报关日志
     * @returns string
     */
    public static saveForecastLogUsingPOST(): Promise<string> {
        return ajax("POST", "/customs/saveForecastLog", {}, {});
    }

    /**
     * @description 报关附件上传
     * @returns string
     */
    public static uploadAttachmentUsingPOST(): Promise<string> {
        return ajax("POST", "/customs/uploadAttachment", {}, {});
    }

    /**
     * @description 获取报关单详情
     * @returns Customs
     */
    public static getByIdUsingGET(): Promise<Customs> {
        return ajax("GET", "/customs/{id}", {}, {});
    }
}
