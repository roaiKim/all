import {ajax} from "../../core";
// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export class AppAJAXService {
    // 到达提货地;
    public static arriveSendLocalUsingGET(): Promise<any> {
        return ajax("GET", "/app/arriveSendLocal/{id}/{stowageOrderSegmentId}", {}, {});
    }

    // 要求退回;
    public static backLocalUsingGET(): Promise<any> {
        return ajax("GET", "/app/backLocal/{stowageOrderSegmentId}", {}, {});
    }

    // 离开目的地;
    public static leaveReceiptLocalUsingGET(): Promise<any> {
        return ajax("GET", "/app/leaveSendLocal/{id}/{stowageOrderSegmentId}", {}, {});
    }

    // 派送扫码获取数据;
    public static deliveryScanCodeUsingGET(): Promise<any> {
        return ajax("GET", "/app/order/deliveryScanCode", {}, {});
    }

    // 派送签收;
    public static deliverySignUsingPOST(): Promise<any> {
        return ajax("POST", "/app/order/deliverySign", {}, {});
    }

    // 扫码取货;
    public static scanCodePickUpUsingPOST(): Promise<any> {
        return ajax("POST", "/app/order/scanCodePickUp", {}, {});
    }

    // 签收扫码获取数据;
    public static signScanCodeUsingGET(): Promise<any> {
        return ajax("GET", "/app/order/signScanCode", {}, {});
    }

    // 扫描二维码进入运单详情;
    public static scanStowageNumberUsingGET(): Promise<any> {
        return ajax("GET", "/app/scanStowageNumber", {}, {});
    }

    // 删除凭证;
    public static deleteVoucherUsingGET(): Promise<any> {
        return ajax("GET", "/app/sendCar/deleteVoucher/{attachmentId}", {}, {});
    }

    // 获取凭证列表;
    public static getAttachmentListUsingGET(): Promise<any> {
        return ajax("GET", "/app/sendCar/getAttachmentList/{stowageOrderId}", {}, {});
    }

    // 上传凭证;
    public static uploadVoucherUsingPOST(): Promise<any> {
        return ajax("POST", "/app/sendCar/uploadVoucher", {}, {});
    }

    // 配载单列表;
    public static stowageListUsingPOST(): Promise<any> {
        return ajax("POST", "/app/stowage/list", {}, {});
    }
}
