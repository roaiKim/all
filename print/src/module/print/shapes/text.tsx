import { useEffect, useRef, useState } from "react";
import type { WebPrint } from "../main/print";
import type { DramaActor } from "../type";
import "./index.less";

interface DramaActorProps {
    printModule: WebPrint;
    printElement: DramaActor;
}

export function Agent(props: DramaActorProps) {
    const { printElement, printModule } = props;
    const { x, y, width, height, content, id, type } = printElement || {};

    const [PrintWebElement] = useState<any>(() => printModule.getPluginByName(type).render);

    return (
        <div className="print-element">
            <PrintWebElement {...printElement}></PrintWebElement>
        </div>
    );
}
