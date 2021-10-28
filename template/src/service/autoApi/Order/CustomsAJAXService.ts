/* eslint-disable quotes */
import { OrderCargoCount, CustomsDTO, CustomsDownloadLog, CustomsLog, Page, Customs, PublicPagination, CustomsLogDTO, Attachment } from "../orderType";
import { ajax } from "core";

// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class CustomsAJAXService {
    /**
     * @description 订单已报关统计
     * @param in path {number} orderId
     * @returns OrderCargoCount
     */
    public static customsCargoCountUsingGET(orderId: number): Promise<OrderCargoCount> {
        return ajax("GET", `/customs/cargoCount/{orderId}`, { orderId }, {});
    }

    /**
     * @description 删除报关单
     * @param in body {number[]} ids
     * @returns string
     */
    public static deleteUsingPOST(ids: number[]): Promise<string> {
        return ajax("POST", `/customs/delete`, {}, { ids });
    }

    /**
     * @description 打包下载报关单关联的订单附件
     * @param in path {number} orderId
     * @returns void
     */
    public static batchDownloadUsingGET(orderId: number): Promise<void> {
        return ajax("GET", `/customs/download/{orderId}`, { orderId }, {});
    }

    /**
     * @description 打包下载报关单附件
     * @param in path {number} id
     * @returns void
     */
    public static downloadCustomsZipUsingGET(id: number): Promise<void> {
        return ajax("GET", `/customs/downloadCustomsZip/{id}`, { id }, {});
    }

    /**
     * @description 创建报关单
     * @param in body {CustomsDTO} orderCustoms
     * @returns number
     */
    public static editCustomsUsingPOST(orderCustoms: CustomsDTO): Promise<number> {
        return ajax("POST", `/customs/edit`, {}, { orderCustoms });
    }

    /**
     * @description 根据报关单
     * @param in path {number} id
     * @returns CustomsDownloadLog[]
     */
    public static getDownloadLogUsingGET(id: number): Promise<CustomsDownloadLog[]> {
        return ajax("GET", `/customs/getDownloadLog/{id}`, { id }, {});
    }

    /**
     * @description 查看操作日志
     * @param in path {number} id
     * @returns CustomsLog[]
     */
    public static getLogUsingGET(id: number): Promise<CustomsLog[]> {
        return ajax("GET", `/customs/getLog/{id}`, { id }, {});
    }

    /**
     * @description 报关单列表
     * @param in body {PublicPagination} queryCondition
     * @returns Page<Customs>
     */
    public static listUsingPOST(queryCondition: PublicPagination): Promise<Page<Customs>> {
        return ajax("POST", `/customs/list`, {}, { queryCondition });
    }

    /**
     * @description 创建报关单
     * @param in body {CustomsDTO} orderCustoms
     * @returns number
     */
    public static saveCustomsUsingPOST(orderCustoms: CustomsDTO): Promise<number> {
        return ajax("POST", `/customs/save`, {}, { orderCustoms });
    }

    /**
     * @description 保存报关日志
     * @param in body {CustomsLogDTO} orderCustoms
     * @returns string
     */
    public static saveCustomsLogUsingPOST(orderCustoms: CustomsLogDTO): Promise<string> {
        return ajax("POST", `/customs/saveCustomsLog`, {}, { orderCustoms });
    }

    /**
     * @description 保存预录报关日志
     * @param in body {CustomsLogDTO} orderCustoms
     * @returns string
     */
    public static saveForecastLogUsingPOST(orderCustoms: CustomsLogDTO): Promise<string> {
        return ajax("POST", `/customs/saveForecastLog`, {}, { orderCustoms });
    }

    /**
     * @description 报关附件上传
     * @param in query {number} id
     * @param in body {Attachment[]} attachments
     * @returns string
     */
    public static uploadAttachmentUsingPOST(id: number, attachments: Attachment[]): Promise<string> {
        return ajax("POST", `/customs/uploadAttachment?id=${id}`, {}, { attachments });
    }

    /**
     * @description 获取报关单详情
     * @param in path {number} id
     * @returns Customs
     */
    public static getByIdUsingGET(id: number): Promise<Customs> {
        return ajax("GET", `/customs/{id}`, { id }, {});
    }
}
