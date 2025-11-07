import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { type DragState, initialDragState, ListenerType, WebPrint } from "./print";
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
    const temporaryTemplateRef = useRef<HTMLDivElement>(null);
    const printContainer = useRef<HTMLDivElement>(null);

    const [printElement, setPrintElement] = useState<Record<string, PrintElement>>({});
    const [printTemporaryTemplate, setPrintTemporaryTemplate] = useState(initialDragState());

    const [printModule, setPrintModule] = useState<WebPrint>();
    const customDragEvent = useRef<CustomerDragingEvent>(null);

    useLayoutEffect(() => {
        const print = new WebPrint(printCurtain.current, temporaryTemplateRef.current);
        customDragEvent.current = new CustomerDragingEvent(print, printContainer.current);
        setPrintModule(print);
    }, []);

    const actorChange = useCallback((actor) => {
        setPrintElement(actor);
    }, []);

    useEffect(() => {
        if (printTemporaryTemplate.moving) {
            customDragEvent.current?.mousemove();
            customDragEvent.current?.mouseup();
        } else {
            customDragEvent.current?.destroy();
        }
        return () => {
            customDragEvent.current?.destroy();
        };
    }, [printTemporaryTemplate.moving]);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(ListenerType.actorChange, (actor) => {
                actorChange(actor);
            });
            printModule.subscribe(ListenerType.dragStateChange, (state) => {
                setPrintTemporaryTemplate((prev) => ({ ...prev, ...state }));
            });
        }
    }, [printModule]);

    console.log("--state-", printTemporaryTemplate);
    return (
        <div className="print-container" ref={printContainer}>
            <Header printModule={printModule} />
            <Operate />
            <Rule></Rule>
            <PrintBody ref={printCurtain} printElement={printElement} />
            <div
                ref={temporaryTemplateRef}
                className={`print-temporary-template ${printTemporaryTemplate.moving ? "moving" : ""}`}
                style={{
                    top: printTemporaryTemplate.y,
                    left: printTemporaryTemplate.x,
                    width: printTemporaryTemplate.width,
                    height: printTemporaryTemplate.height,
                }}
            ></div>
        </div>
    );
}
