import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { type DragState, initialDragState, ListenerType, WebPrint } from "./print";
import TemporaryTemplate from "./temporary-template";
import { CustomerDragingEvent } from "../event/draging-event";
import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import "./index.less";

export interface PrintElement extends DragState {
    id: string;
    content: string;
    option?: any;
}

export default function Assemble() {
    const printCurtain = useRef<HTMLElement>(null);
    const printContainer = useRef<HTMLDivElement>(null);

    const [printElement, setPrintElement] = useState<PrintElement[]>([]);

    const [printModule, setPrintModule] = useState<WebPrint>();
    const customDragEvent = useRef<CustomerDragingEvent>(null);

    useLayoutEffect(() => {
        const print = new WebPrint();
        customDragEvent.current = new CustomerDragingEvent(print);
        setPrintModule(print);
    }, []);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(ListenerType.actorChange, (actor) => {
                console.log("--actor-正在改动-", actor);
                setPrintElement(() => actor);
            });
        }
    }, [printModule]);

    return (
        <div id="printContainerDom" className="print-container" ref={printContainer}>
            <Header printModule={printModule} />
            <Operate />
            <Rule></Rule>
            <PrintBody ref={printCurtain} printElement={printElement} printModule={printModule} />
            <TemporaryTemplate printModule={printModule} />
        </div>
    );
}
