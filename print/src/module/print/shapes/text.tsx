import { useEffect, useRef, useState } from "react";
import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";
import "./index.less";

interface PrintRenderPrint {
    printModule: WebPrint;
    printElement: PrintElement;
}

export function PrintRender(props: PrintRenderPrint) {
    const { printElement, printModule } = props;
    const { x, y, width, height, content, id, type } = printElement || {};

    const [PrintWebElement] = useState<any>(() => printModule.getPluginByName(type).render);

    return (
        <div className="print-element">
            <PrintWebElement {...printElement}></PrintWebElement>
        </div>
    );
}
