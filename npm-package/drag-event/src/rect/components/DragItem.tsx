import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { v4 } from "uuid";
import { DragContainerContext } from "./DragContainer";
import { DragAgentContext } from "./DragContext";
import { EventState, initialDragState } from "../event/agent";
import { DragEventManager } from "../event/drag-event";

export interface DragItemProps {
    id?: string;
    className?: string;
    style?: Omit<React.CSSProperties, "width" | "height" | "top" | "left" | "bottom" | "right" | "position">;
    /**
     * @description drag:copy; move:move
     */
    mode?: "drag" | "move";
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export function DragItem(props: PropsWithChildren<DragItemProps>) {
    const { className, style, id, mode = "move", width, height, x, y } = props;
    const dragItemId = useMemo(() => id || v4(), [id]);
    const ref = useRef(null);
    const dragAgent = useContext(DragAgentContext);
    const container = useContext(DragContainerContext);
    const dragEventManager = useRef<DragEventManager>(null);

    const [state, setState] = useState(initialDragState(dragItemId, mode));

    if (!dragAgent) {
        console.error("DragItem 组件需要包裹在 DragContext");
        return props.children;
    }

    useEffect(() => {
        dragAgent.pushDragTargetState(initialDragState(dragItemId, mode));
        return () => {
            dragAgent.deleteDragTargetState(dragItemId);
        };
    }, [dragItemId]);

    const onMouseDown = (event: React.MouseEvent) => {
        dragAgent.dragStart(event, dragItemId);
    };

    const onStateChange = useCallback((state: EventState) => {
        if (state.state?._uid === dragItemId) {
            // if (state.changeType === "end") {
            //     setState(initialDragState(dragItemId, mode));
            // } else {
            setState(state.state);
            // }
            // console.log("-item-change-state---", state.changeType, state);
        }
    }, []);

    useEffect(() => {
        dragAgent.subscribe("onStateChange", onStateChange);
    }, [dragAgent]);

    useEffect(() => {
        setState((prevState) => ({ ...prevState, width, height, y, x }));
    }, [width, height, x, y]);
    // console.log("-item-state--", state);
    return (
        <div
            className={classNames("rosen-item", className, {
                "is-draging": state.mode === "drag" && state.draging,
                "is-move": state.mode === "move",
            })}
            style={{
                ...style,
                width: state.width,
                height: state.height,
                top: state.y,
                left: state.x,
            }}
            ref={ref}
            onMouseDown={onMouseDown}
        >
            {props.children}
        </div>
    );
}
