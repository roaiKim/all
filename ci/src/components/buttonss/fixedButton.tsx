import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import "./index.less";

interface FixedButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    position?: "bottom" | "top";
    className?: string;
    fixed?: boolean;
    style?: React.CSSProperties;
}

export default function FixedButton(props: PropsWithChildren<FixedButtonProps>) {
    const { onClick, disabled, children, position = "bottom", className = "", fixed = true, style } = props;

    const cls = classNames({
        "ro-button-container": true,
        "ro-flex": true,
        [`ro-fixed-` + position]: fixed,
        [className]: className,
    });

    return (
        <div className={cls}>
            <button disabled={disabled} onClick={onClick} style={style || null}>
                {children}
            </button>
        </div>
    );
}
