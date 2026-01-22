import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { WebPrint } from "./print";
import { CustomerDragingEvent } from "../event/draging-event";
import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import { initialStageDirections } from "../storyboard";
import { IncidentalMusic, type StageDirections } from "../type";
import "./index.less";

export interface PrintElement extends StageDirections {
    id: string;
    content: string;
    option?: any;
}

interface TemporaryTemplateProps {
    printModule: WebPrint;
}

export default function TemporaryTemplate(props: TemporaryTemplateProps) {
    const { printModule } = props;
    const [printTemporaryTemplate, setPrintTemporaryTemplate] = useState(initialStageDirections());
    const CustomerDragPrint = useRef((...args) => null);

    const customDragEvent = useRef<CustomerDragingEvent>(null);

    useLayoutEffect(() => {
        if (printModule) {
            customDragEvent.current = new CustomerDragingEvent(printModule);
            printModule.subscribe(IncidentalMusic.dragStateChange, (state) => {
                // console.log("--printTemporaryTemplate--", state);
                setPrintTemporaryTemplate((prev) => ({ ...prev, ...state }));
            });
        }
    }, [printModule]);

    // useEffect(() => {
    //     if (printTemporaryTemplate.moving) {
    //         customDragEvent.current?.mousemove();
    //         customDragEvent.current?.mouseup();
    //     } else {
    //         customDragEvent.current?.destroyAll();
    //     }
    //     return () => {
    //         customDragEvent.current?.destroyAll();
    //     };
    // }, [printTemporaryTemplate.moving]);

    useEffect(() => {
        if (printTemporaryTemplate.type) {
            CustomerDragPrint.current = printModule.getPluginByName(printTemporaryTemplate.type).dragRender;
        }
    }, [printTemporaryTemplate.type]);

    return (
        <div
            id="temporaryTemplateDom"
            className={`print-temporary-template ${printTemporaryTemplate.draging ? "moving" : ""}`}
            style={{
                top: printTemporaryTemplate.y,
                left: printTemporaryTemplate.x,
                width: printTemporaryTemplate.width,
                height: printTemporaryTemplate.height,
            }}
        >
            <CustomerDragPrint.current {...printTemporaryTemplate}></CustomerDragPrint.current>
        </div>
    );
}
