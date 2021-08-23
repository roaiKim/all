import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class ExportAJAXService {
    /**
     * @description 导出订单业务联系单
     * @param in path{number} orderId
     * @returns void
     */
    public static exportBusinessContactFormUsingPOST(orderId: number): Promise<void> {
        return ajax("POST", "/export/businessContactForm/{orderId}", {}, {});
    }

    /**
     * @description 导出载货清单
     * @param in path{number} orderId
     * @returns void
     */
    public static exportManifestUsingPOST(orderId: number): Promise<void> {
        return ajax("POST", "/export/manifest/{orderId}", {}, {});
    }

    /**
     * @description 导出选择的未生成运单的配载段托运单
     * @param in body {number[]} ids
     * @returns void
     */
    public static exportOrderSegmentBookingNoteUsingPOST(ids: number[]): Promise<void> {
        return ajax("POST", "/export/orderSegmentBookingNote", {}, {});
    }

    /**
     * @description 导出委托单
     * @param in path{number} orderId
     * @returns void
     */
    public static exportOrderTicketUsingPOST(orderId: number): Promise<void> {
        return ajax("POST", "/export/orderTicket/{orderId}", {}, {});
    }

    /**
     * @description 导出签收单
     * @param in path{number} orderId
     * @returns void
     */
    public static exportSignatureFormUsingPOST(orderId: number): Promise<void> {
        return ajax("POST", "/export/signatureForm/{orderId}", {}, {});
    }

    /**
     * @description 导出运单托运单
     * @param in path{number} stowageId
     * @returns void
     */
    public static exportStowageBookingNoteUsingPOST(stowageId: number): Promise<void> {
        return ajax("POST", "/export/stowageBookingNote/{stowageId}", {}, {});
    }

    /**
     * @description 导出运单拼车表
     * @param in path{number} stowageId
     * @returns void
     */
    public static exportCarpoolingListUsingPOST(stowageId: number): Promise<void> {
        return ajax("POST", "/export/stowageCarpoolingList/{stowageId}", {}, {});
    }
}
