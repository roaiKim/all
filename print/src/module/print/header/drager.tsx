import { type PropsWithChildren, useEffect, useRef } from "react";
import IconButton from "./icon-button";
import { DragEventManager } from "../drag-event/drag-event";
import type { WebPrint } from "../main/print";
import type { RolesName } from "../type";
type IconButtonPointer = "pointer" | "move";

interface DragerProps {
    text: string;
    draggableType?: RolesName;
    hoverMask?: boolean;
    pointer?: IconButtonPointer & string;
    printModule: WebPrint;
}

export default function Drager(props: PropsWithChildren<DragerProps>) {
    const { text, children, pointer, hoverMask, draggableType, printModule } = props;

    const dragRef = useRef(null);

    useEffect(() => {
        if (draggableType && printModule) {
            new DragEventManager(
                {
                    draggableType,
                    dragger: dragRef.current,
                },
                printModule
            );
        }
    }, [draggableType, printModule]);

    return (
        <IconButton ref={dragRef} text={text} draggableType={draggableType} hoverMask={hoverMask} pointer={pointer}>
            {children}
        </IconButton>
    );
}
