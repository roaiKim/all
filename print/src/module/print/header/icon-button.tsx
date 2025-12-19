import classNames from "classnames";
import type { PropsWithChildren } from "react";

type IconButtonPointer = "pointer" | "move";

interface IconButtonProps {
    text?: string;
    draggableType?: string;
    title?: string;
    pointer?: IconButtonPointer & string;
    hoverMask?: boolean;
    size?: ("s" | "m" | "l") & string;
    draggable?: boolean;
    onDragEnd?: (event, config) => void;
}

export default function IconButton(props: PropsWithChildren<IconButtonProps>) {
    const { text, children, pointer, hoverMask, size, title, draggable, draggableType } = props;

    const classname = classNames({
        "rk-icon-button": true,
        [`${pointer || ""}`]: true,
        [`${size || ""}`]: true,
        "hover-mask": hoverMask,
    });

    return (
        <div className={classname} title={title} data-draggable-type={draggableType}>
            <div>
                {children}
                <span className="rk-ib-text">{text}</span>
            </div>
        </div>
    );
}
