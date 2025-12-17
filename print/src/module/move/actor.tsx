import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { initialDragState, WebEvent } from "./event";

export default function Actor() {
    const act = useRef(null);
    const [state, setState] = useState(initialDragState());

    const move = useCallback((state) => {
        setState((prev) => ({ ...prev, ...state }));
    }, []);

    useEffect(() => {
        const webEvent = new WebEvent("web-actor", "web-container", move);
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
