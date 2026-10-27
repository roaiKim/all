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
    const { className, style, id, mode, width, height, x, y } = props;
    const dragItemId = useMemo(() => id || v4(), [id]);
    const ref = useRef(null);
    const dragAgent = useContext(DragAgentContext);
    const container = useContext(DragContainerContext);
    const dragMode = useRef<"drag" | "move">(mode || (container ? "move" : "drag"));

    const dragEventManager = useRef<DragEventManager>(null);

    const [state, setState] = useState(initialDragState(dragItemId, dragMode.current));

    if (!dragAgent) {
        console.error("DragItem 组件需要包裹在 DragContext");
        return props.children;
    }

    useEffect(() => {
        dragAgent.pushDragTargetState(initialDragState(dragItemId, dragMode.current));
        return () => {
            dragAgent.deleteDragTargetState(dragItemId);
        };
    }, [dragItemId]);

    const onMouseDown = (event: React.MouseEvent) => {
        dragAgent.dragStart(event, dragItemId, dragMode.current === "move" ? container.element : undefined);
    };

    const dragMove = useCallback((state: EventState) => {
        // 非拖拽
        if (state.state.mode === "drag") return;
        if (state.state?._uid === dragItemId) {
            setState(state.state);
        }
    }, []);

    useEffect(() => {
        if (dragMode.current === "move") {
            dragAgent.subscribe("onStateChange", dragMove);
        }
        return () => {
            dragAgent.unsubscribe("onStateChange", dragMove);
        };
    }, [dragAgent, dragMode]);

    useEffect(() => {
        setState((prevState) => ({ ...prevState, width, height, y, x }));
    }, [width, height, x, y]);
    // console.log("-item-state--", state);
    return (
        <div
            className={classNames("rosen-item", className, {
                "is-draging": dragMode.current === "drag" && state.draging,
                "is-move": dragMode.current === "move",
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
