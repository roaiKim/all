import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { initialDragState } from "./base-event";
import { DragEventManager } from "./drag-event";

export default function Actor() {
    const act = useRef(null);
    const [state, setState] = useState(initialDragState());

    const move = useCallback((state) => {
        setState((prev) => ({ ...prev, ...state }));
    }, []);

    useEffect(() => {
        const webEvent = new DragEventManager({
            dragger: "web-actor",
            container: "web-container",
            moving: move,
        });
    }, []);
    console.log("--------state--", state);
    return (
        <div
            id="web-actor"
            ref={act}
            style={{
                top: state.y,
                left: state.x,
                width: state.width,
                height: state.height,
            }}
        ></div>
    );
}
