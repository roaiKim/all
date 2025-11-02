import { useRef, useState } from "react";
import { message } from "antd";
import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import { CurtainLocationManager } from "../utils/CurtainLocationManager";
import { UidManager } from "../utils/UidManager";
import "./index.less";

const initialPrintTemporaryTemplate = () => ({
    x: 0,
    y: 0,
    type: "",
    with: 180,
    height: 24,
    moving: false,
});

export interface PrintElement {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    option?: any;
}

export default function Assemble() {
    const [printTemporaryTemplate, setPrintTemporaryTemplate] = useState(initialPrintTemporaryTemplate());
    const printCurtain = useRef<HTMLElement>(null);
    const temporaryTemplateRef = useRef<HTMLDivElement>(null);
    const [printElement, setPrintElement] = useState<Record<string, PrintElement>>({});

    // const [draging, setDraging] = useState({
    //     type: "",
    //     with: 100,
    //     height: 35,
    //     moving: false,
    // });

    const onDragEnd = (event, config) => {
        // console.log("-onDragEnd-", event, config);
    };

    const onMouseDown = (event, config) => {
        // console.log("-onMouseDown-", event, config);
        setPrintTemporaryTemplate((prev) => ({ ...prev, x: event.pageX, y: event.pageY, moving: true }));
    };

    const addPrintElement = (state: { x: number; y: number; width?: number; height?: number }) => {
        const elements = { ...printElement };
        const id = UidManager.getUid();
        elements[id] = {
            id,
            type: "",
            x: 0,
            y: 0,
            width: 180,
            height: 24,
            content: "文本模板",
            option: {},
            ...state,
        };
        setPrintElement(elements);
    };

    const onMouseUp = (event, config) => {
        // console.log("-onMouseUp-", event, config);
        if (!printTemporaryTemplate.moving) return;
        if (printCurtain.current) {
            const isWrap = CurtainLocationManager.isChildrenInContainer(temporaryTemplateRef.current, printCurtain.current, true);
            if (isWrap) {
                // console.log("-elementRect-", true);
                const position = CurtainLocationManager.getPositionByContainer(temporaryTemplateRef.current, printCurtain.current);
                console.log("-position-", position);
                addPrintElement({ ...position });
                // addPrintElement({});
            } else {
                message.error("请拖拽到幕布中");
            }
        }
        setPrintTemporaryTemplate(initialPrintTemporaryTemplate());
    };

    const onContainerMoving = (event, config) => {
        console.log("-onContainerMoving-", event);
        if (!printTemporaryTemplate.moving) return;
        // console.log("-onContainerMoving-", event.pageX, event.pageY);
        setPrintTemporaryTemplate((prev) => ({ ...prev, x: event.pageX, y: event.pageY }));
    };

    return (
        <div className="print-container" onMouseMove={onContainerMoving} onMouseUp={onMouseUp}>
            <Header onDragEnd={onDragEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
            <Operate />
            <Rule></Rule>
            <PrintBody ref={printCurtain} printElement={printElement} />
            <div
                ref={temporaryTemplateRef}
                className={`print-temporary-template ${printTemporaryTemplate.moving ? "moving" : ""}`}
                style={{
                    top: printTemporaryTemplate.y - printTemporaryTemplate.height / 2,
                    left: printTemporaryTemplate.x - printTemporaryTemplate.with / 2,
                    width: printTemporaryTemplate.with,
                    height: printTemporaryTemplate.height,
                }}
            ></div>
        </div>
    );
}
