import { useState } from "react";
import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import "./index.less";

const initialPrintTemporaryTemplate = () => ({
    x: 0,
    y: 0,
    type: "",
    with: 100,
    height: 35,
    moving: false,
});

export default function Assemble() {
    const [printTemporaryTemplate, setPrintTemporaryTemplate] = useState(initialPrintTemporaryTemplate());

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

    const onMouseUp = (event, config) => {
        // console.log("-onMouseUp-", event, config);
        setPrintTemporaryTemplate(initialPrintTemporaryTemplate());
    };

    const onContainerMoving = (event, config) => {
        if (!printTemporaryTemplate.moving) return;
        console.log("-onContainerMoving-", event.pageX, event.pageY);
        setPrintTemporaryTemplate((prev) => ({ ...prev, x: event.pageX, y: event.pageY }));
    };

    return (
        <div className="print-container" onMouseMove={onContainerMoving} onMouseUp={onMouseUp}>
            <Header onDragEnd={onDragEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
            <Operate />
            <Rule></Rule>
            <PrintBody />
            <div
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
