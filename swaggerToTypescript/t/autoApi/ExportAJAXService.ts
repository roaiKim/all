import {ajax} from "../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class ExportAJAXService {
    // 导出订单业务联系单;
    public static exportBusinessContactFormUsingPOST(): Promise<any> {
        return ajax("POST", "/export/businessContactForm/{orderId}", {}, {});
    }

    // 导出载货清单;
    public static exportManifestUsingPOST(): Promise<any> {
        return ajax("POST", "/export/manifest/{orderId}", {}, {});
    }

    // 导出选择的未生成运单的配载段托运单;
    public static exportOrderSegmentBookingNoteUsingPOST(): Promise<any> {
        return ajax("POST", "/export/orderSegmentBookingNote", {}, {});
    }

    // 导出委托单;
    public static exportOrderTicketUsingPOST(): Promise<any> {
        return ajax("POST", "/export/orderTicket/{orderId}", {}, {});
    }

    // 导出签收单;
    public static exportSignatureFormUsingPOST(): Promise<any> {
        return ajax("POST", "/export/signatureForm/{orderId}", {}, {});
    }

    // 导出运单托运单;
    public static exportStowageBookingNoteUsingPOST(): Promise<any> {
        return ajax("POST", "/export/stowageBookingNote/{stowageId}", {}, {});
    }

    // 导出运单拼车表;
    public static exportCarpoolingListUsingPOST(): Promise<any> {
        return ajax("POST", "/export/stowageCarpoolingList/{stowageId}", {}, {});
    }
}
