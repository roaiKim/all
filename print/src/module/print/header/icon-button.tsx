import classNames from "classnames";
import type { PropsWithChildren } from "react";

type IconButtonPointer = "pointer" | "move";

interface IconButtonProps {
    text?: string;
    title?: string;
    pointer?: IconButtonPointer & string;
    hoverMask?: boolean;
    size?: ("s" | "m" | "l") & string;
    draggable?: boolean;
    onDragEnd?: (event, config) => void;
}

export default function IconButton(props: PropsWithChildren<IconButtonProps>) {
    const { text, children, pointer, hoverMask, size, title, draggable, onDragEnd, onMouseDown, onMouseUp } = props;
    const clasname = classNames({
        "rk-icon-button": true,
        [`${pointer || ""}`]: true,
        [`${size || ""}`]: true,
        "hover-mask": hoverMask,
    });
    return (
        <div
            className={clasname}
            title={title}
            // draggable={draggable}
            onDragEnd={(event) => {
                onDragEnd(event, "12");
            }}
            onMouseDown={(event) => {
                onMouseDown(event, "12");
            }}
            onMouseUp={(event) => {
                onMouseUp(event, "12");
            }}
        >
            {children}
            <span className="rk-ib-text">{text}</span>
        </div>
    );
}
