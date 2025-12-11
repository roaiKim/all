import { BasePrintPlugin } from "./base-print-plugin";
import type { DragState } from "../main/print";
import { DraggableType } from "../main/static";

export class TextPlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.TEXT,
            title: "文本",
            height: 16,
            width: 200,
        });
    }

    // render() {
    //     return "ddddddddddddd";
    // }
}

export class ImgPlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.IMG,
            title: "图片",
            height: 128,
            width: 128,
        });
    }
}

export class BrcodePlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.BRCODE,
            title: "条形码",
            height: 50,
            width: 180,
        });
    }

    dragRender(props) {
        return <div>BRCODE</div>;
    }
}

export class QRcodePlugin extends BasePrintPlugin {
    constructor() {
        super({
            type: "base",
            key: DraggableType.QRCODE,
            title: "二维码",
            height: 128,
            width: 128,
        });
    }
}
