import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { v4 } from "uuid";
import { DragAgentContext } from "./DragContext";
import { DragContainerState } from "../event/agent";
import { DragEventManager } from "../event/drag-event";

export interface DragContainerProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const DragContainerContext = createContext<DragContainerState | null>(null);

export function DragContainer(props: PropsWithChildren<DragContainerProps>) {
    const { className, style, id } = props;
    const containerRef = useRef(null);
    const dragAgent = useContext(DragAgentContext);
    const containerIdRef = useRef(id || v4());
    const [dragContainer, setDragContainer] = useState(null);

    useEffect(() => {
        if (containerRef.current && dragAgent) {
            const dragTargetRect = containerRef.current.getBoundingClientRect();
            const width = dragTargetRect.width;
            const height = dragTargetRect.height;
            const x = dragTargetRect.x + window.pageXOffset;
            const y = dragTargetRect.y + window.pageYOffset;
            const dragContainer = {
                _uid: containerIdRef.current,
                element: containerRef.current,
                width,
                height,
                x,
                y,
            };
            setDragContainer(dragContainer);
            dragAgent.pushDragContainer(dragContainer);
        }
        return () => {
            dragAgent.deleteDragContainer(containerIdRef.current);
        };
    }, [containerRef]);

    if (!dragAgent) {
        console.error("DragContainer 组件需要包裹在 DragContext");
        return props.children;
    }

    return (
        <DragContainerContext value={dragContainer}>
            <div className={classNames("rosen-container", className)} style={style} ref={containerRef}>
                {props.children}
            </div>
        </DragContainerContext>
    );
}
