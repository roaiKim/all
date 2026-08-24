import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Attribute from "module/attribute/component";
import type { DragBaseEventManagerProps } from "../event/base";
import { DragEventManager, type DragEventManagerProps } from "../event/drag-event";

// onDragStart?: (state: DragBaseEventManager["dragState"]) => void;
//     onDragMove?: (state: DragBaseEventManager["dragState"]) => void;
//     onDragEnd?: (state: DragBaseEventManager["dragState"], isWrap: boolean) => void;

export function useDrag(props: DragBaseEventManagerProps) {
    const [state, setState] = useState({ x: 0, y: 0, width: 0, height: 0, draging: false, moving: false });

    const onDragStart = useCallback((dragState) => {
        setState(Object.assign(state, dragState));
    }, []);
    const onDragMove = useCallback((dragState) => {
        setState(Object.assign(state, dragState));
    }, []);
    const onDragEnd = useCallback((dragState) => {
        setState(Object.assign(state, dragState));
    }, []);

    const dragEventManagement = useMemo(() => {
        return new DragEventManager({
            ...props,
            onDragStart,
            onDragMove,
            onDragEnd,
        });
    }, []);

    const options = useRef({
        attribute: { role: "drag-role", "aria-disabled": true },
    });

    return {
        dragState: state,
        attribute: options.current.attribute,
    };
}
