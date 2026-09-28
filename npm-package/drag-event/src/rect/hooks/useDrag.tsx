import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { DragBaseEventManagerProps } from "../event/base";
import { DragEventManager } from "../event/drag-event";

export interface UseDragProps extends Omit<DragBaseEventManagerProps, "dragger"> {
    dragger: RefObject<HTMLElement | null>;
}

export function useDrag(props: UseDragProps) {
    const [state, setState] = useState({ x: 0, y: 0, width: 0, height: 0, draging: false, moving: false });
    const dragEventManagement = useRef<DragEventManager | null>(null);
    const onDragStart = useCallback((dragState) => {
        setState((prev) => ({ ...prev, ...dragState }));
    }, []);
    const onDragMove = useCallback((dragState) => {
        setState((prev) => ({ ...prev, ...dragState }));
    }, []);
    const onDragEnd = useCallback((dragState) => {
        setState((prev) => ({ ...prev, ...dragState }));
    }, []);

    useEffect(() => {
        const dragger = props.dragger.current;
        if (dragger) {
            dragEventManagement.current = new DragEventManager({
                ...props,
                dragger,
                onDragStart,
                onDragMove,
                onDragEnd,
            });
        }
        return () => {
            dragEventManagement.current?.destroy();
            dragEventManagement.current = null;
        };
    }, [props.dragger]);

    const options = useRef({
        attribute: { role: "drag-role", "aria-disabled": true },
    });

    return {
        dragState: state,
        attribute: options.current.attribute,
    };
}
