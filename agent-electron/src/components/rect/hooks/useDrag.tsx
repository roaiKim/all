import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Attribute from "module/attribute/component";
import type { DragBaseEventManagerProps } from "../event/base";
import { DragEventManager, type DragEventManagerProps } from "../event/drag-event";

// onDragStart?: (state: DragBaseEventManager["dragState"]) => void;
//     onDragMove?: (state: DragBaseEventManager["dragState"]) => void;
//     onDragEnd?: (state: DragBaseEventManager["dragState"], isWrap: boolean) => void;

export function useDrag(props: DragBaseEventManagerProps) {
    const [state, setState] = useState({ x: 0, y: 0, width: 0, height: 0, draging: false, moving: false });
    const dragEventManagement = useRef<DragEventManager>(null);
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
        if (props.dragger) {
            dragEventManagement.current = new DragEventManager({
                ...props,
                onDragStart,
                onDragMove,
                onDragEnd,
            });
        }
        return () => {
            if (dragEventManagement.current) {
                return dragEventManagement.current.destroy();
            }
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
