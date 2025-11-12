import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CustomerSpotlightEvent } from "../event/spotlight-event";
import type { PrintElement } from "../main";
import { ListenerType, type MovingState, type WebPrint } from "../main/print";
import "./index.less";

interface ControllerProps {
    element: PrintElement;
    printModule: WebPrint;
    movingState: MovingState;
    spotlighting: boolean;
}

export function Controller(props: PropsWithChildren<ControllerProps>) {
    const { element, children, printModule, movingState, spotlighting } = props;
    const { x, y, width, height, content, id } = element || {};

    const printControlRef = useRef(null);
    const spotlightEventRef = useRef(null);
    const [position, setPosition] = useState(() => ({ left: x, top: y, width, height, moving: false }));

    useEffect(() => {
        if (id) {
            if (movingState.id === id) {
                const { x, y, width, height, moving, type } = movingState;
                console.log(`当前${type}元素(${id})正在移动`, moving);
                setPosition(() => ({ left: x, top: y, width, height, moving }));
            }
        }
    }, [movingState, id]);

    useEffect(() => {
        if (printModule) {
            spotlightEventRef.current = new CustomerSpotlightEvent(printModule, printControlRef.current, element);
        }
    }, [printModule]);

    const clasName = classNames({
        "print-element-control": true,
        spotlighting,
        moving: position.moving,
    });

    return (
        <div ref={printControlRef} className={`${clasName}`} style={position} data-draggable-id={id}>
            {children} {position.left} <br /> {position.top}
            <div className="print-control tl" data-fluctuate-direction="tl"></div>
            <div className="print-control tr" data-fluctuate-direction="tr"></div>
            <div className="print-control bl" data-fluctuate-direction="bl"></div>
            <div className="print-control br" data-fluctuate-direction="br"></div>
            <div className="print-control mt" data-fluctuate-direction="mt"></div>
            <div className="print-control mb" data-fluctuate-direction="mb"></div>
            <div className="print-control ml" data-fluctuate-direction="ml"></div>
            <div className="print-control mr" data-fluctuate-direction="mr"></div>
        </div>
    );
}
