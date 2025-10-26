import classNames from "classnames";
import type { PropsWithChildren } from "react";

type IconButtonPointer = "pointer" | "move";

interface IconButtonProps {
    text?: string;
    title?: string;
    pointer?: IconButtonPointer & string;
    hoverMask?: boolean;
    size?: ("s" | "m" | "l") & string;
}

export default function IconButton(props: PropsWithChildren<IconButtonProps>) {
    const { text, children, pointer, hoverMask, size, title } = props;
    const clasname = classNames({
        "rk-icon-button": true,
        [`${pointer || ""}`]: true,
        [`${size || ""}`]: true,
        "hover-mask": hoverMask,
    });
    return (
        <div className={clasname} title={title}>
            {children}
            <span className="rk-ib-text">{text}</span>
        </div>
    );
}
