import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class ExportAJAXService {
    /**
     * @description 导出订单业务联系单
     * @returns void
     */
    public static exportBusinessContactFormUsingPOST(): Promise<void> {
        return ajax("POST", "/export/businessContactForm/{orderId}", {}, {});
    }

    /**
     * @description 导出载货清单
     * @returns void
     */
    public static exportManifestUsingPOST(): Promise<void> {
        return ajax("POST", "/export/manifest/{orderId}", {}, {});
    }

    /**
     * @description 导出选择的未生成运单的配载段托运单
     * @returns void
     */
    public static exportOrderSegmentBookingNoteUsingPOST(): Promise<void> {
        return ajax("POST", "/export/orderSegmentBookingNote", {}, {});
    }

    /**
     * @description 导出委托单
     * @returns void
     */
    public static exportOrderTicketUsingPOST(): Promise<void> {
        return ajax("POST", "/export/orderTicket/{orderId}", {}, {});
    }

    /**
     * @description 导出签收单
     * @returns void
     */
    public static exportSignatureFormUsingPOST(): Promise<void> {
        return ajax("POST", "/export/signatureForm/{orderId}", {}, {});
    }

    /**
     * @description 导出运单托运单
     * @returns void
     */
    public static exportStowageBookingNoteUsingPOST(): Promise<void> {
        return ajax("POST", "/export/stowageBookingNote/{stowageId}", {}, {});
    }

    /**
     * @description 导出运单拼车表
     * @returns void
     */
    public static exportCarpoolingListUsingPOST(): Promise<void> {
        return ajax("POST", "/export/stowageCarpoolingList/{stowageId}", {}, {});
    }
}
