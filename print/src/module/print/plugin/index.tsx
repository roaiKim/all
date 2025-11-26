import { BasePrintPlugin } from "./base-print-plugin";
import { DraggableType } from "../main/static";

export class TextPlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.TEXT,
            title: "文本",
            height: 24,
            width: 100,
        });
    }
}

export class ImgPlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.IMG,
            title: "图片",
            height: 64,
            width: 64,
        });
    }
}

export class BrcodePlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.BRCODE,
            title: "条形码",
            height: 100,
            width: 64,
        });
    }
}

export class QRcodePlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.QRCODE,
            title: "二维码",
            height: 64,
            width: 64,
        });
    }
}
