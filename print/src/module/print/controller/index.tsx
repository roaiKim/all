import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import type { PrintElement } from "../main";
import { ListenerType, type MovingState, type WebPrint } from "../main/print";
import "./index.less";

interface ControllerProps {
    element: PrintElement;
    printModule: WebPrint;
    movingState: MovingState;
}

export function Controller(props: PropsWithChildren<ControllerProps>) {
    const { element, children, printModule, movingState } = props;
    const { x, y, width, height, content, id } = element || {};
    const [moving, setMoving] = useState(false);

    const rectRef = useRef(null);

    const [position, setPosition] = useState(() => ({ left: x, top: y, width, height }));
    const [origin, setOrigin] = useState([0, 0]);

    // const movingStateChange = useCallback(
    //     (state) => {
    //         console.log("--moving--", state);
    //     },
    //     [id]
    // );

    useEffect(() => {
        if (id) {
            if (movingState.id === id) {
                const { x, y, width, height } = movingState;
                setPosition(() => ({ left: x, top: y, width, height }));
            }
        }
    }, [movingState, id]);

    return (
        <div ref={rectRef} className="print-element-container" style={position} data-draggable-id={id}>
            {children}
        </div>
    );
}
