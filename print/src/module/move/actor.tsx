import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { initialDragState } from "./base-event";
import { DragEventManager } from "./drag-event";

export default function Actor(props) {
    const act = useRef(null);
    const [state, setState] = useState(initialDragState());

    const move = useCallback((state) => {
        setState((prev) => ({ ...prev, ...state }));
    }, []);

    const movEnd = useCallback((state, isWrap) => {
        // setState((prev) => ({ ...prev, ...state }));
        if (isWrap) {
            props.addActor(state);
            return;
        } else {
            message.error("请拖拽到容器内");
        }
    }, []);

    useEffect(() => {
        const webEvent = new DragEventManager({
            dragger: "web-actor",
            container: "web-container",
            moving: move,
            movEnd,
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

export function ChildrenActor(props) {
    const { print } = props;
    const act = useRef(null);
    // const [state, setState] = useState(initialDragState());

    const move = useCallback((state) => {
        // setState((prev) => ({ ...prev, ...state }));
    }, []);

    useEffect(() => {
        // const webEvent = new DragEventManager({
        //     dragger: "web-actor",
        //     container: "web-container",
        //     moving: move,
        // });
    }, []);

    console.log("--------state--", print);
    return (
        <div
            className="web-children-actor"
            ref={act}
            style={{
                top: print.y,
                left: print.x,
                width: print.width,
                height: print.height,
            }}
        ></div>
    );
}
