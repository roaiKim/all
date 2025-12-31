import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CustomerSpotlightEvent, MoveDirection } from "../event/spotlight-event";
import type { DramaActor } from "../main";
import { type Protagonist, type WebPrint } from "../main/print";
import { MoveEventManager } from "../move-event/move-event";
import "./index.less";

interface DirectorProps {
    element: DramaActor;
    printModule: WebPrint;
    protagonist: Protagonist;
    spotlighting: boolean;
}

export function Director(props: PropsWithChildren<DirectorProps>) {
    const { element, children, printModule, protagonist, spotlighting } = props;
    const { x, y, width, height, content, id } = element || {};

    const directorRef = useRef(null);
    const spotlightEventRef = useRef<CustomerSpotlightEvent>(null);
    const [position, setPosition] = useState(() => ({ left: x, top: y, width, height, moving: false, resizing: false }));

    useEffect(() => {
        if (id) {
            if (protagonist.dramaActor.id === id) {
                const { dramaActor, moving, resizing } = protagonist;
                const { x, y, width, height } = dramaActor;
                console.log(/* `当前${type}元素(${id})正在移动`,  */ protagonist);
                setPosition(() => ({ left: x, top: y, width, height, moving, resizing }));
            }
        }
    }, [protagonist, id]);

    // useEffect(() => {
    //     if (printModule) {
    //         spotlightEventRef.current = new CustomerSpotlightEvent(printModule, printControlRef.current, id);
    //     }
    // }, [printModule]);

    // useEffect(() => {
    //     if (spotlighting) {
    //         spotlightEventRef.current.registerResize();
    //     } else {
    //         // removeResize
    //         // spotlightEventRef.current?.removeResize();
    //     }
    // }, [spotlighting]);

    useEffect(() => {
        if (printModule) {
            new MoveEventManager(
                { state: element, container: printModule.domManger.printTemplateDom, mover: directorRef.current, initMousedownEvent: true },
                printModule
            );
        }
    }, [printModule]);

    const className = classNames({
        "print-element-control": true,
        spotlighting,
        moving: position.moving,
    });
    console.log("element--", element);
    return (
        <div id="printControlDom" ref={directorRef} className={`${className}`} style={position} data-draggable-id={id}>
            {children}
            <div className="print-control tl" data-fluctuate-direction={MoveDirection.TOP_LEFT}></div>
            <div className="print-control tr" data-fluctuate-direction={MoveDirection.TOP_RIGHT}></div>
            <div className="print-control bl" data-fluctuate-direction={MoveDirection.BOTTOM_LEFT}></div>
            <div className="print-control br" data-fluctuate-direction={MoveDirection.BOTTOM_RIGHT}></div>
            <div className="print-control mt" data-fluctuate-direction={MoveDirection.MIDDLE_TOP}></div>
            <div className="print-control mb" data-fluctuate-direction={MoveDirection.MIDDLE_BOTTOM}></div>
            <div className="print-control ml" data-fluctuate-direction={MoveDirection.MIDDLE_LEFT}></div>
            <div className="print-control mr" data-fluctuate-direction={MoveDirection.MIDDLE_RIGHT}></div>
        </div>
    );
}
